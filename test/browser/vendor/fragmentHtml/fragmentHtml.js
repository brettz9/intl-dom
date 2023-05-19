// Todo: Move to own repo?
/// <reference types="chai" />

/** @type {Chai.ChaiPlugin} */
const fragmentHtml = function (_chai, utils) {
  const {flag} = utils;

  /**
   * @param {DocumentFragment} contents
   * @returns {HTMLDivElement}
   */
  const container = (contents) => {
    const dummyContainer = document.createElement('div');
    dummyContainer.append(contents);
    return dummyContainer;
  };

  _chai.Assertion.addMethod('fragmentHtml', function (html) {
    const frag = flag(this, 'object'),
      actual = container(flag(this, 'object')).innerHTML;

    if (flag(this, 'contains')) {
      this.assert(
        actual.includes(html),
        'expected #{act} to contain HTML #{exp}',
        'expected #{act} not to contain HTML #{exp}',
        html,
        actual
      );
    } else {
      this.assert(
        actual === html,
        'expected ' + String(frag) +
          ' to have HTML #{exp}, but the HTML was #{act}',
        'expected ' + String(frag) + ' not to have HTML #{exp}',
        html,
        actual
      );
    }
  });
};

export default fragmentHtml;
