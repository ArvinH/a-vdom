import diff from './diff';

const zip = (xs, ys) => {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(rNode => {
      rNode.appendChild(render(additionalVChild));
      return rNode;
    });
  }

  return rParent => {
    // since childPatches are expecting the rChild, not rParent,
    // we cannot just loop through them and call patch(rParent)
    for (const [patch, rChild] of zip(childPatches, rParent.childNodes)) {
      patch(rChild);
    }

    for (const patch of additionalPatches) {
      patch(rParent);
    }
    return rParent;
  };
};

export default diffChildren;