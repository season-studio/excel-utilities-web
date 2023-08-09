import { ActionResult } from "./dataTypes/actionResult";
import { FlowController } from "./dataTypes/specialFlowTypes";

const ARG_TYPE_CONTEXT = 0;
const ARG_TYPE_DIRECT = 1;
const ARG_TYPE_REF_RESULT = 2;
const ARG_TYPE_REF_LOOPINDEX = 3;

function formatArgumentInPrepare(_arg, _signature) {
    if ("value" in _arg) {
        return {
            type: ARG_TYPE_DIRECT,
            value: _arg.value
        };
    } else if ("refResult" in _arg) {
        return {
            type: ARG_TYPE_REF_RESULT,
            refStepID: _arg.refResult.stepID,
            _signature
        };
    } else if ("refLoopIndex" in _arg) {
        return {
            type: ARG_TYPE_REF_LOOPINDEX,
            refStepID: _arg.refLoopIndex.stepID,
            _signature
        };
    } else if ("defaultValue" in _signature) {
        return {
            type: ARG_TYPE_DIRECT,
            value: _signature.defaultValue
        };
    }
}

const DEF_WATCHDOG_MS = 300;

/**
 * 动作流程引擎
 */
export class ActionFlowEngine extends EventTarget {
    #lock;
    #actionResultCache;

    constructor(_flow, _actionCollection) {
        super();

        if (!_flow instanceof Array) {
            throw new TypeError("_flow must be an array");
        }

        if (!_actionCollection || (typeof _actionCollection !== "object")) {
            throw new TypeError("_actionCollection paramerater is incorrect");
        }
        
        this.#prepare(_flow, _actionCollection);
    }

    watchdogMS = DEF_WATCHDOG_MS;

    #prepare(_flow, _actionCollection) {
        this.#actionResultCache = {};
        this.errorStepIndex = Number.NaN;
        this.#lock = false;

        let stepIDLocator = {};

        let stepInfos = _flow.map((oriStep, index) => {
            let action = oriStep?.action;
            (typeof action !== "function") && (action = _actionCollection[action]);
            if (typeof action !== "function") {
                console.error("步骤无效", index, action);
                throw new Error(`步骤(${index})无效`);
            }

            let actionSignature = action.getActionSignature();
            if (!actionSignature) {
                throw new Error(`找不到${action.name}的签名信息`);
            }

            let stepArgs = oriStep.arguments||[];
            let passCount = 0;
            let variableIndex = -1;
            let variableSignature;
            let optionalIndex = -1;
            let args = actionSignature.arguments?.map((argumentSignature, idx) => {
                if (argumentSignature?.isContext) {
                    passCount++;
                    return {
                        type: ARG_TYPE_CONTEXT
                    };
                } else if (argumentSignature.variable) {
                    variableIndex = idx - passCount;
                    variableSignature = argumentSignature;
                } else {
                    let arg = stepArgs[idx - passCount];
                    if (arg) {
                        arg = formatArgumentInPrepare(arg, argumentSignature);
                        if (arg) {
                            return arg;
                        } else {
                            throw `步骤(${index})${action.name}参数(${idx})无法正确赋值`;
                        }
                    } else if (optionalIndex < 0) {
                        optionalIndex = idx;
                    }
                }
            })||[];
            if (optionalIndex >= 0) {
                args.splice(optionalIndex);
            }
            if (variableIndex >= 0) {
                args.splice(variableIndex);
                stepArgs.forEach((argItem, idx) => {
                    if (idx >= variableIndex) {
                        let arg = formatArgumentInPrepare(argItem||{}, variableSignature);
                        if (arg) {
                            args.push(arg);
                        } else {
                            throw `步骤(${index})${action.name}参数(${idx})无法正确赋值`;
                        }
                    }
                });
            }

            stepIDLocator[oriStep.id || String(index)] = index;

            return Object.assign({
                index
            }, oriStep, {
                name: actionSignature.name,
                action,
                arguments: args,
                returnData: !!(actionSignature.returnType?.length > 0),
                forceAsync: actionSignature.forceAsync
            });
        });

        Object.defineProperties(this, {
            flow: {
                value: stepInfos
            }, 
            stepIDLocator: {
                value: stepIDLocator
            }
        });
    }

    get stepIndex() {
        if (this.#lock) {
            let event = new CustomEvent("query-current-step-index", {
                detail: {
                    index: -1
                }
            });
            this.dispatchEvent(event);
            return event.detail.index;
        } else {
            return -1;
        }
    }

    getStepResult(_stepID) {
        return this.#actionResultCache[_stepID];
    }

    async * execute(_customContext) {
        if (!this.#lock) {
            this.#lock = true;
            this.error = undefined;
            this.errorStepIndex = Number.NaN;
            let stepIndex = 0;
            let onQueryStepIndex = function () { return stepIndex; };
            this.addEventListener("query-current-step-index", onQueryStepIndex);
            let watchdogTick = Date.now();
            let watchdogOverflow = Number(this.watchdogMS)||DEF_WATCHDOG_MS;
            let watchdogTimer = setInterval(() => {
                watchdogTick = Date.now()
            }, watchdogOverflow - 10);
            try {
                let flow = this.flow;
                let resultCache = (this.#actionResultCache = {});
                let context = Object.assign(_customContext||{}, {engine: this});
                context.abortSignal || (context.abortSignal = (new AbortController()).signal);

                while ((stepIndex >= 0) && (stepIndex < flow.length) && (!context.abortSignal.aborted)) {
                    try {
                        let stepInfo = flow[stepIndex];
                        let action = stepInfo.action;
                        // prepare the arguments
                        let args = stepInfo.arguments.map((argInfo, idx) => {
                            try {
                                let argType = argInfo.type;
                                if (argType === ARG_TYPE_CONTEXT) {
                                    context.stepInfo = stepInfo;
                                    context.stepIndex = stepIndex;
                                    return context;
                                } else if (argType === ARG_TYPE_DIRECT) {
                                    return argInfo.value;
                                } else if (argType === ARG_TYPE_REF_LOOPINDEX) {
                                    let refData = this.getStepResult(argInfo.refStepID);
                                    if (!("iterateIndex" in refData)) {
                                        throw `步骤(${stepIndex})${action.name}参数(${idx})引用的数据无法取得循环迭代次数`;
                                    }
                                    refData = new ActionResult(refData.iterateIndex);
                                    if (argInfo.argumentSignature) {
                                        try {
                                            return refData.getFixedData(argInfo.argumentSignature);
                                        } catch {
                                            throw `步骤(${stepIndex})${action.name}参数(${idx})引用的数据不符合类型要求`;
                                        }
                                    } else {
                                        return refData.rawData;
                                    }
                                } else {
                                    let refData = this.getStepResult(argInfo.refStepID);
                                    if (argInfo.argumentSignature) {
                                        try {
                                            return refData.getFixedData(argInfo.argumentSignature);
                                        } catch {
                                            throw `步骤(${stepIndex})${action.name}参数(${idx})引用的数据不符合类型要求`;
                                        }
                                    } else {
                                        return refData.rawData;
                                    }
                                }
                            } catch (err) {
                                console.error(err);
                                throw new Error(`步骤(${stepIndex})${action.name}参数(${idx})无法正确赋值`, { cause: err });
                            }
                        });
                        // executing and storing the result
                        let result = action.apply(null, args);
                        if (result instanceof Promise) {
                            result = await result;
                        } else if ((Date.now() - watchdogTick > watchdogOverflow) || (stepInfo.forceAsync)) {
                            await new Promise(r => setImmediate(r));
                        }
                        // console.debug("STEP #", stepIndex, "=>", result);
                        let flowController;
                        if (result instanceof FlowController) {
                            flowController = result;
                            result = undefined;
                        }
                        if (result instanceof Iterator) {
                            result = new ActionResult(result);
                            result.iterateNext();
                            if (result.iterateDone) {
                                flowController = new FlowController({
                                    toStep: stepInfo.relationStep[0]
                                });
                            }
                        }
                        if (stepInfo.returnData) {
                            result = ActionResult(result);
                            result.stepInfo = stepInfo;
                            resultCache[stepInfo.id] = result;
                        } else {
                            result = undefined;
                        }
                        // adjust the index of the next step
                        if (flowController) {
                            if (flowController.end) {
                                stepIndex = flow.length;
                            } else {
                                stepIndex = this.stepIDLocator[flowController.toStep];
                                if (stepIndex >= 0) {
                                    (("offset" in flowController) ? (stepIndex += Number(flowController.offset)||0) : (stepIndex++));
                                } else {
                                    throw new Error(`invalid id${flowController.toStep} of the step to jump to`);
                                }
                            }
                        } else {
                            ++stepIndex;
                        }
                        // yield return the result of the current step
                        yield result;
                    } catch (err) {
                        this.errorStepIndex = stepIndex;
                        throw err;
                    }
                }
            } catch (error) {
                console.error(error);
                this.error = error;
                let handledError = false;
                this.dispatchEvent(new CustomEvent("action-error", { 
                    detail: {
                        engine: this,
                        error, 
                        handledError: function () { handledError = true; } 
                    } 
                }));
                if (!handledError) {
                    throw error;
                }
            } finally {
                this.removeEventListener("query-current-step-index", onQueryStepIndex);
                this.#lock = false;
                watchdogTimer && clearInterval(watchdogTimer);
            }
        }
    }

    * iterateResult() {
        for (let result of Object.values(this.#actionResultCache)) {
            yield result;
        }
    }
}
