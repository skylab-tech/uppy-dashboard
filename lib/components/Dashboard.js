function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const {
  h
} = require('preact');

const classNames = require('classnames');

const isDragDropSupported = require('@uppy/utils/lib/isDragDropSupported');

const FileList = require('./FileList');

const AddFiles = require('./AddFiles');

const AddFilesPanel = require('./AddFilesPanel');

const PickerPanelContent = require('./PickerPanelContent');

const EditorPanel = require('./EditorPanel');

const PanelTopBar = require('./PickerPanelTopBar');

const FileCard = require('./FileCard');

const Slide = require('./Slide'); // http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal


const WIDTH_XL = 900;
const WIDTH_LG = 700;
const WIDTH_MD = 576;
const HEIGHT_MD = 400;

module.exports = function Dashboard(props) {
  const noFiles = props.totalFileCount === 0;
  const isSizeMD = props.containerWidth > WIDTH_MD;
  const wrapperClassName = classNames({
    'uppy-Root': props.isTargetDOMEl
  });
  const dashboardClassName = classNames({
    'uppy-Dashboard': true,
    'uppy-Dashboard--isDisabled': props.disabled,
    'uppy-Dashboard--animateOpenClose': props.animateOpenClose,
    'uppy-Dashboard--isClosing': props.isClosing,
    'uppy-Dashboard--isDraggingOver': props.isDraggingOver,
    'uppy-Dashboard--modal': !props.inline,
    'uppy-size--md': props.containerWidth > WIDTH_MD,
    'uppy-size--lg': props.containerWidth > WIDTH_LG,
    'uppy-size--xl': props.containerWidth > WIDTH_XL,
    'uppy-size--height-md': props.containerHeight > HEIGHT_MD,
    'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel,
    'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible
  }); // Important: keep these in sync with the percent width values in `src/components/FileItem/index.scss`.

  let itemsPerRow = 1; // mobile

  if (props.containerWidth > WIDTH_XL) {
    itemsPerRow = 5;
  } else if (props.containerWidth > WIDTH_LG) {
    itemsPerRow = 4;
  } else if (props.containerWidth > WIDTH_MD) {
    itemsPerRow = 3;
  }

  const showFileList = props.showSelectedFiles && !noFiles;
  const numberOfFilesForRecovery = props.recoveredState ? Object.keys(props.recoveredState.files).length : null;
  const numberOfGhosts = props.files ? Object.keys(props.files).filter(fileID => props.files[fileID].isGhost).length : null;

  const renderRestoredText = () => {
    if (numberOfGhosts > 0) {
      return props.i18n('recoveredXFiles', {
        smart_count: numberOfGhosts
      });
    }

    return props.i18n('recoveredAllFiles');
  };

  const dashboard = h("div", {
    className: dashboardClassName,
    "data-uppy-theme": props.theme,
    "data-uppy-num-acquirers": props.acquirers.length,
    "data-uppy-drag-drop-supported": !props.disableLocalFiles && isDragDropSupported(),
    "aria-hidden": props.inline ? 'false' : props.isHidden,
    "aria-disabled": props.disabled,
    "aria-label": !props.inline ? props.i18n('dashboardWindowTitle') : props.i18n('dashboardTitle'),
    onPaste: props.handlePaste,
    onDragOver: props.handleDragOver,
    onDragLeave: props.handleDragLeave,
    onDrop: props.handleDrop
  }, h("div", {
    "aria-hidden": "true",
    className: "uppy-Dashboard-overlay",
    tabIndex: -1,
    onClick: props.handleClickOutside
  }), h("div", {
    className: "uppy-Dashboard-inner",
    "aria-modal": !props.inline && 'true',
    role: !props.inline && 'dialog',
    style: {
      width: props.inline && props.width ? props.width : '',
      height: props.inline && props.height ? props.height : ''
    }
  }, !props.inline ? h("button", {
    className: "uppy-u-reset uppy-Dashboard-close",
    type: "button",
    "aria-label": props.i18n('closeModal'),
    title: props.i18n('closeModal'),
    onClick: props.closeModal
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")) : null, h("div", {
    className: "uppy-Dashboard-innerWrap"
  }, h("div", {
    className: "uppy-Dashboard-dropFilesHereHint"
  }, props.i18n('dropHint')), showFileList && h(PanelTopBar, props), numberOfFilesForRecovery && h("div", {
    className: "uppy-Dashboard-serviceMsg"
  }, h("svg", {
    className: "uppy-Dashboard-serviceMsg-icon",
    "aria-hidden": "true",
    focusable: "false",
    width: "21",
    height: "16",
    viewBox: "0 0 24 19"
  }, h("g", {
    transform: "translate(0 -1)",
    fill: "none",
    fillRule: "evenodd"
  }, h("path", {
    d: "M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z",
    fill: "#FFD300"
  }), h("path", {
    fill: "#000",
    d: "M11 6h2l-.3 8h-1.4z"
  }), h("circle", {
    fill: "#000",
    cx: "12",
    cy: "17",
    r: "1"
  }))), h("strong", {
    className: "uppy-Dashboard-serviceMsg-title"
  }, props.i18n('sessionRestored')), h("div", {
    className: "uppy-Dashboard-serviceMsg-text"
  }, renderRestoredText())), showFileList ? h(FileList, _extends({}, props, {
    itemsPerRow: itemsPerRow
  })) : h(AddFiles, _extends({}, props, {
    isSizeMD: isSizeMD
  })), h(Slide, null, props.showAddFilesPanel ? h(AddFilesPanel, _extends({
    key: "AddFiles"
  }, props, {
    isSizeMD: isSizeMD
  })) : null), h(Slide, null, props.fileCardFor ? h(FileCard, _extends({
    key: "FileCard"
  }, props)) : null), h(Slide, null, props.activePickerPanel ? h(PickerPanelContent, _extends({
    key: "Picker"
  }, props)) : null), h(Slide, null, props.showFileEditor ? h(EditorPanel, _extends({
    key: "Editor"
  }, props)) : null), h("div", {
    className: "uppy-Dashboard-progressindicators"
  }, props.progressindicators.map(target => {
    return props.uppy.getPlugin(target.id).render(props.state);
  })))));
  return (// Wrap it for RTL language support
    h("div", {
      className: wrapperClassName,
      dir: props.direction
    }, dashboard)
  );
};