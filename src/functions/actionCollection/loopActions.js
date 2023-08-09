import { FlowController } from "../dataTypes/specialFlowTypes";

/**
 * 按次数循环
 * @param {number} _count 循环的总次数 <<< {"editor.ui":{prefix:"循环",postfix:"次"}}
 * @yields {number} 循环计数
 * @StepActionSignature
 * @autoRelationWith loopNext
 * @category 杂项
 * @hideTitleInEditor
 */
export function * loopForCount(_count) {
    _count = Number(_count)||0;
    for (let i = 0; i < _count; i++) {
        yield i;
    }
}

/**
 * 进入下一轮循环
 * @param {Context} _context 
 * @StepActionSignature
 * @hiddenForCustomer
 */
export function loopNext(_context) {
    if (_context) {
        let loopResult;
        let loopStep = (_context.stepInfo?.relationStep||[]).find(relStep => {
           loopResult = _context.engine?.getStepResult(relStep);
           return !!loopResult;
        });
        if (loopResult?.iterateNext) {
            loopResult.iterateNext();
            if (!loopResult.iterateDone) {
                return new FlowController({
                    toStep: loopStep
                });
            }
        }
    }
}
