export default (element, targetNode) => {
  targetNode.appendChild(element);
  //targetNode.replaceWith(element);
  return element;
};