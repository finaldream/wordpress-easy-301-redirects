
export const sortByProperty : ({}, {}, property: string ) => number = (a, b, property ) => {
    let sortOrder : -1|1 = 1;
    if (property[0] === '-') {
        sortOrder = -1
        property = property.substr(1);
    } 
    return ( (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0 ) * sortOrder;    
}


export const sortByMultipleProperties : ({}, {}, properties: Array<string> ) => number = (a, b, properties) => {
    let i = 0;
    let result = 0;
    let numberOfProperties = properties.length;
    while (result === 0 && i < numberOfProperties) {
        result = sortByProperty(a,b, properties[i]);
        i++;
    }
    return result;
}