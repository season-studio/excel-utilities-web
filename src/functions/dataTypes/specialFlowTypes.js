export function FlowController(_opts) {
    if (!(this instanceof FlowController)) {
        throw new TypeError("FlowController only used with new operator");
    }
    (typeof _opts === "object") && Object.assign(this, _opts);
    Object.freeze(this);
}
