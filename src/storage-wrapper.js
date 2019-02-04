import MainStorage from "./main-storage.js";
let build = function (store, indexKey) {
    let storeLocal = {};
    let localIndex = [];
    if (store.get(indexKey)) {
        try {
            let indexData = JSON.parse(store.get(indexKey));
            if (Array.isArray(indexData)) {
                localIndex = indexData;
            }
        } catch(e) {
            console.log("data was corrupted");
        }
    } else {
        store.set(indexKey, JSON.stringify(localIndex));
    }

    let getStorageKey = function(key) {
        return indexKey + ":" + key;
    }
    storeLocal.addItem = function (key, value) {
        let storageKey = getStorageKey(key);
        store.set(storageKey, value);
        if (localIndex.indexOf(key) == -1) {
            localIndex.push(key);
        }
        storeLocal.saveIndexToDisk();
    }
    storeLocal.getItem = function(key) {
        let storageKey = getStorageKey(key);
        return store.get(storageKey);
    }
    storeLocal.getIndex = function() {
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
        store.remove(storageKey);
        let position = localIndex.indexOf(key);
        if (position > -1) {
            localIndex.splice(position, 1);
            storeLocal.saveIndexToDisk();
        }
    }

    storeLocal.saveIndexToDisk = function () {
        store.set(indexKey, JSON.stringify(localIndex));
    }

    return storeLocal;
}

export default {
    build
}