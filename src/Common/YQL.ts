import $ from '../JQueryLite'
export function query(query: string): Promise<any> {
    return $.get('https://query.yahooapis.com/v1/public/yql', {
        q: query,
        format: "json"
    }).then(res => {
        return res.query.results.json;
    });
}