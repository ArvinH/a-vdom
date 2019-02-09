import render from './render';
import diffAttrs from './diffAttrs';
import diffChildren from './diffChildren';

const diff = (oldVTreeRoot, newVTreeRoot) => {
  // 假設 oldVTreeRoot 一定都存在，只有 newVTreeRoot 有機會被刪除，也就是 undefined
  if (newVTreeRoot === undefined) {
    // 回傳 patch 函數，會接收 Real DOM，這邊 r 開頭的都代表 Real DOM，v 開頭為 Virtual DOM
    return rNode => {
      // 因為新的 Virtual DOM Tree 是空的，所以回傳的 Patch 函式就是直接把 Real DOM 刪除。
      rNode.remove();
      return undefined;
    }
  }
  if (typeof oldVTreeRoot === 'string' ||
    typeof newVTreeRoot === 'string') {
    if (oldVTreeRoot !== newVTreeRoot) {
      // 這邊包含兩種 cases：
      // Case 1：新舊 Virtual DOM Tree 其中一個為 string，一個為 Virtual Node，所以當然會 !==
      // Case 2：是兩者都為 string，但 !==
      // 我們直接根據新的 Virtual Tree render 新的 Real Tree，並 replace 掉原本的 Real Tree
      return rNode => {
          // 回傳 patch 函數
          const rNewNode = render(newVTreeRoot);
          rNode.replaceWith(rNewNode);
          return rNewNode;
       };
    } else {
      // 若都為 string 且值相同，那就不用改。
      return rNode => rNode; // 回傳 patch 函數
    }
  }
  if (oldVTreeRoot.tagName !== newVTreeRoot.tagName) {
    // 根據優化 Tree diffing 演算法的假設一，只要 tagName 不同，我們就直接重新 render。
    return rNode => {
      // 回傳 patch 函數
      const rNewNode = render(newVTreeRoot);
      rNode.replaceWith(rNewNode);
      return rNewNode;
    };
  }

  const patchAttrs = diffAttrs(oldVTreeRoot.attrs, newVTreeRoot.attrs);
  const patchChildren = diffChildren(oldVTreeRoot.children, newVTreeRoot.children);

  return rNode => {
    patchAttrs(rNode);
    patchChildren(rNode);
    return rNode;
  };
};

export default diff;