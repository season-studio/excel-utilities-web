import { ifCondition, compare, endIf, logicAnd, logicOr, logicNot, ifElse } from "./logicActions";
import getTableFromClipboard from "./getTableFromClipboard";
import inputByUser from "./inputByUser";
import { loopForCount, loopNext } from "./loopActions";
import { nop, toNumber, debugOutput, showTip, clearDisplay, referenceData, raiseError, triggerBreakpoint } from "./miscActions";
import { copyObjectFromOther, createObject, removeObjectItem, setObjectItem, getObjectItem, getObjectItemWithDefault, testHasItem, loopForObjectItems } from "./objectDataActions";
import { readRecordValue, writeRecordValue } from "./recordValue";
import selectFromTable from "./selectFromTable";
import { testTextByRegex, advancePickupSubText, concatText, getTextLength, indexOfSubText, lastIndexOfSubText, pickupSubText, splitText, testContains, testEndsWith, testStartsWith, trimText, toUpperCase, toLowerCase } from "./stringActions";
import { createArray, makeupArray, getArrayLength, setArrayLength, getArrayElement, setArrayElement, appendArrayElement, appendArrayElementByArray, insertArrayElement, removeArrayElement, getSubArray, indexOfElement, lastIndexOfElement, loopForArrayElement, concatArray, connectAsText } from "./arrayActions";
import { getTableCellData, getTableRow, getTableColumn, updateTableCell, appendTableRow, appendTableColumn, updateTableRow, updateTableColumn, createTable, getTableSize, declareTableCellCoordinate, loopForTableRow, loopForTableColumn } from "./tableActions";
import { add, sub, mul, div, mod, bitAnd, bitOr, bitXor, bitNand, bitNor, bitXnor, bitNot, getMathConstant, mathFunction } from "./calculateActions";

const actionCollection = {
    inputByUser,
    getTableFromClipboard,
    selectFromTable,
    getTableCellData, getTableRow, getTableColumn, appendTableRow, appendTableColumn, updateTableCell, updateTableRow, updateTableColumn, createTable, getTableSize, declareTableCellCoordinate, loopForTableRow, loopForTableColumn,
    trimText, getTextLength, testStartsWith, testEndsWith, testContains, indexOfSubText, lastIndexOfSubText, pickupSubText, splitText, testTextByRegex, advancePickupSubText, concatText, toUpperCase, toLowerCase,
    add, sub, mul, div, mod, bitAnd, bitOr, bitXor, bitNand, bitNor, bitXnor, bitNot, getMathConstant, mathFunction,
    ifCondition, endIf, compare, logicAnd, logicOr, logicNot, ifElse,
    createObject, setObjectItem, getObjectItem, getObjectItemWithDefault, removeObjectItem, copyObjectFromOther, testHasItem, loopForObjectItems,
    createArray, makeupArray, getArrayLength, setArrayLength, getArrayElement, setArrayElement, appendArrayElement, appendArrayElementByArray, insertArrayElement, removeArrayElement, getSubArray, indexOfElement, lastIndexOfElement, loopForArrayElement, concatArray, connectAsText, 
    nop, toNumber, 
    readRecordValue, writeRecordValue,
    loopForCount, loopNext,
    showTip, clearDisplay, referenceData, debugOutput, raiseError, triggerBreakpoint
};

const SYM_ACTION_SIGNATURE = Symbol("single.action.signature");

(function () {
    try {
        const signatures = StepActionSignatures;
        for (let name in actionCollection) {
            let action = actionCollection[name];
            let signItem = signatures[name];
            if (signItem && (typeof action === "function")) {
                action[SYM_ACTION_SIGNATURE] = Object.freeze(signItem);
            }
        }
    } catch (err) {
        console.error("Fail in signature the single actions", err);
    }
    Function.prototype.getActionSignature = function () {
        return this[SYM_ACTION_SIGNATURE];
    };
})();

export default actionCollection;
