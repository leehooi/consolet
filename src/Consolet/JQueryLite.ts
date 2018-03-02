export class JQueryLite {
    constructor(public element?: Element) {
    }

    addClass(className: string): JQueryLite {
        let classList = this.element.className.split(' ').filter(c => c != '');
        classList.push(className);
        this.element.className = classList.join(' ');
        return this;
    }
    append(element: Element | JQueryLite): JQueryLite {
        if (element instanceof Element) {
            this.element.appendChild(element);
        }
        else {
            this.element.appendChild(element.element);
        }
        return this;
    }
    parent(): JQueryLite {
        return  new JQueryLite(this.element.parentElement);
    }
    removeLastChild(): JQueryLite {
        if (this.element.childElementCount > 0) {
            this.element.removeChild(this.element.lastChild);
        }
        return this;
    }
    empty(): JQueryLite {
        this.element.innerHTML = '';
        return this;
    }
    scrollToBottom(): JQueryLite {
        this.element.scrollTo(0, this.element.scrollHeight);
        return this;
    }
    text(val: string): JQueryLite {
        this.element.textContent = val;
        return this;
    }
}


function extend<T, U>(first: T, second: U): T & U {
    for (let id in second) {
        if (!first.hasOwnProperty(id)) {
            (<any>first)[id] = (<any>second)[id];
        }
    }
    return <T & U>first;
}

export default extend(function (selector: string | Element) {
    // Match a standalone tag
    let rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    if (selector instanceof Element) {
        return new JQueryLite(selector);
    }
    else {
        if (rsingleTag.test(selector)) {
            return new JQueryLite(document.createElement(rsingleTag.exec(selector)[1]));
        }
        else {
            return new JQueryLite(document.querySelector(selector));
        }
    }
}, {
        param(query: { [key: string]: any }): string {
            let queries = [];
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    queries.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
                }
            }
            return queries.join('&');
        },
        get(url: string, query: any): Promise<any> {
            let http = new XMLHttpRequest();
            return new Promise<string>((resolve, reject) => {
                http.onreadystatechange = (evt) => {
                    if (http.readyState == 4 && http.status == 200) {
                        resolve(JSON.parse(http.responseText))
                    }
                };
                http.open("GET", `${url}?${this.param(query)}`, true);
                http.send();
            });
        }
    });