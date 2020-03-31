//设置微商id
function setUid(val) {
    localStorage.setItem("uid", val);
}

function getUid() {
    return parseInt(localStorage.getItem("uid"));
}

export const LocalStorageManager = {
    setUid,
    getUid
};