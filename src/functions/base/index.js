export * from "./domhelper";

const ShareDOMParser = new DOMParser();

const HtmlTextEscapeMap = {
    '\"': "&quot;",
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    ' ': "&nbsp;"
};

export function escapeHTMLText(_text) {
    return String(_text).replace(/("|&|<|>| )/ig, chr => (HtmlTextEscapeMap[chr]||""));
}

export function * iterateXPathReault(_result) {
    if (_result) {
        let item;
        while (item = _result.iterateNext()) {
            yield item;
        }
    }
}

export function parseTableFromHTML(_html) {
    if (_html) {
        let doc = ShareDOMParser.parseFromString(_html, "text/html");
        if (doc) {
            let tableNode = doc.querySelector("table");
            if (tableNode) {
                Array.from(tableNode.querySelectorAll("table")).forEach(e => e?.remove());
                let rows = document.evaluate(".//tr", tableNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                let table = Array.from(iterateXPathReault(rows)).map(rowElement => {
                    return Array.from(rowElement.children)
                        .filter(e => ((e.tagName === "TD") || (e.tagName === "TH")))
                        .map(e => {
                            let textVal = String(e.textContent||"").trim();
                            let numVal = (textVal ? Number(textVal) : NaN);
                            return isNaN(numVal) ? textVal : numVal;
                        });
                });
                return table.length > 0 ? table : undefined;
            }
        }
    }
}

export function generateTableHTML(_table) {
    if (_table instanceof Array) {
        return "<table border=\"1\" cellpadding=\"0\" cellspacing=\"0\">\n<tbody>\n" + _table.map((row, rowIdx) => {
            return `<tr d-row-idx="${rowIdx}">\n`
             + ((row instanceof Array) 
                ? row.map((cell, colIdx) => `<td d-row-idx="${rowIdx}" d-col-idx="${colIdx}">${escapeHTMLText(cell)}</td>`).join("\n")
                : `<td d-row-idx="${rowIdx}" d-col-idx="0">${escapeHTMLText(row)}</td>`)
             + "\n</tr>"
        }).join("\n") + "\n</tbody>\n</table>";
    }
}

export async function readTableFromClipboard() {
    let clipItem = (await navigator.clipboard.read())?.at(0);
    if (clipItem) {
        if (clipItem.types?.indexOf("text/html") >= 0) {
            let clipText = await (await clipItem.getType("text/html"))?.text();
            return parseTableFromHTML(clipText);
        }
    }
}

Array.prototype.mapByOrderAsync = function (_mapFn, _thisArg) {
    if (typeof _mapFn === "function") {
        let eventSite = new EventTarget();
        let promises = this.map((_, index) => new Promise((resolve, reject) => {
            try {
                eventSite.addEventListener(`index-${index}`, async () => {
                    try {
                        let ret = _mapFn.call(_thisArg, this[index], index, this);
                        if (ret instanceof Promise) {
                            ret = await ret;
                        }
                        resolve(ret);
                        Promise.resolve().then(() => eventSite.dispatchEvent(new CustomEvent(`index-${index+1}`)));
                    } catch (err) {
                        reject(err);
                        eventSite.dispatchEvent(new CustomEvent("blocked", {detail:index}));
                    }
                });
                eventSite.addEventListener("blocked", (e) => ((e.detail < index) && reject("blocked " + index)));
            } catch(err) {
                reject(err);
                eventSite.dispatchEvent(new CustomEvent("blocked", {detail:index}));
            }
        }));
        eventSite.dispatchEvent(new CustomEvent("index-0"));
        return Promise.all(promises);
    } else {
        return Promise.all([]);
    }
}