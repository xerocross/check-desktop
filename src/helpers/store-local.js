let build = function (indexKey) {
    let storeLocal = {};
    let localIndex = [];


    let readFromMemory = function() {
        try {
            let data = JSON.parse(localStorage.getItem(indexKey));
            if (Array.isArray(data)) {
                localIndex = data;
            } else if (data == null) {
                // do nothing
            } else if (!Array.isArray(data)) {
                throw new Error("");
            }
        } catch (e) {
            throw new Error("store-local: data not formatted correctly");
        }
    
    }
    let getStorageKey = function(key) {
        return indexKey + ":" + key;
    }

    storeLocal.addItem = function (key, value) {
        let storageKey = getStorageKey(key);
        localStorage.setItem(storageKey, value);
        localIndex.push(key);
        storeLocal.saveIndexToDisk();
    }
    storeLocal.getItem = function(key) {
        let storageKey = getStorageKey(key);
        return localStorage.getItem(storageKey);
    }
    storeLocal.getIndex = function() {
        readFromMemory();
        return localIndex;
    }
    storeLocal.getAll = function() {
        storeLocal.getIndex();
        let allItems = [];
        for (let i = 0; i < localIndex.length; i++) {
            allItems.push(storeLocal.getItem(localIndex[i]))
        }
        return allItems;
    }
    storeLocal.removeItem = function(key) {
        let storageKey = getStorageKey(key);
        localStorage.removeItem(storageKey);
        let position = localIndex.indexOf(key);
        if (position > -1) {
            localIndex.splice(position, 1);
            storeLocal.saveIndexToDisk();
        }
    }

    storeLocal.saveIndexToDisk = function () {
        localStorage.setItem(indexKey, JSON.stringify(localIndex));
    }
    readFromMemory();
    return storeLocal;
}

export default {
    build
}