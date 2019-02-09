const diffAttrs = (oldAttrs, newAttrs) => {
  // 因為 attributes 很多，需要一個 array 來存所有需要的 patch 函數
  const patches = [];
  // 放上新的 attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(rNode => {
      // 暫存 patch 函數
      rNode.setAttribute(k, v);
      return rNode;
    });
  }
  // 移除舊的 attributes
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(rNode => {
        // 暫存 patch 函數
        rNode.removeAttribute(k);
        return rNode;
      });
    }
  }
  // 最後傳出去的外層 patch 函數
  return rNode => {
    for (const patch of patches) {
      // 把每個暫存的 patch 函數都 apply 到 Real DOM 上
      patch(rNode);
    }
    return rNode;
  };
};
export default diffAttrs;