import createElement from './createElement';
import render from './render';
import mount from './mount';
import diff from './diff';

const createVApp = count => createElement('div', {
  attrs: {
    id: 'root',
    dataCount: count, // we use the count here
  },
  children: [
    'Hello Kitty',
    createElement('img', {
      attrs: {
        src: `http://placekitten.com/${count}00/${count}00`,
      },
    }),
  ],
});

// const rootApp = render(vRootApp);
// mount(rootApp, document.getElementById('rootApp'));

let vApp = createVApp(0);
const rApp = render(vApp);
let rRootEl = mount(rApp, document.getElementById('rootApp'));

setInterval(() => {
  const n = Math.floor(Math.random() * 10);
  const vNewApp = createVApp(n);
  const patch = diff(vApp, vNewApp);

  // we might replace the whole rRootEl,
  // so we want the patch will return the new rRootEl
  rRootEl = patch(rRootEl);

  vApp = vNewApp;
}, 2000);

// console.log('Virtual DOM:');
// console.dir(vRootApp);
// console.log('Real DOM:');
// console.log(rootApp);
// console.dir(rootApp);
