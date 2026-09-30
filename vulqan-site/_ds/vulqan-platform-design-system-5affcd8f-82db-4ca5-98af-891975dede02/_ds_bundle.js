/* @ds-bundle: {"format":4,"namespace":"VulqanPlatformDesignSystem_5affcd","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"ButtonWithMenu","sourcePath":"components/actions/ButtonWithMenu.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"ToggleButtonGroup","sourcePath":"components/actions/ToggleButtonGroup.jsx"},{"name":"Caption","sourcePath":"components/content/Caption.jsx"},{"name":"CaptionVz","sourcePath":"components/content/CaptionVz.jsx"},{"name":"EmptySpace","sourcePath":"components/content/EmptySpace.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Popover","sourcePath":"components/feedback/Popover.jsx"},{"name":"Snackbar","sourcePath":"components/feedback/Snackbar.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"EntryField","sourcePath":"components/forms/EntryField.jsx"},{"name":"FileSelectionRvp","sourcePath":"components/forms/FileSelectionRvp.jsx"},{"name":"Formfield","sourcePath":"components/forms/Formfield.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"SearchOption","sourcePath":"components/forms/SearchOption.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextArea","sourcePath":"components/forms/TextArea.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"Menu","sourcePath":"components/navigation/Menu.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"e267ccced9a5","components/actions/ButtonWithMenu.jsx":"3b7a5ee2078a","components/actions/IconButton.jsx":"7600ffd21523","components/actions/ToggleButtonGroup.jsx":"208b765a706d","components/content/Caption.jsx":"e655138b773e","components/content/CaptionVz.jsx":"832c84d5508c","components/content/EmptySpace.jsx":"5ffc0a87ea8b","components/feedback/Dialog.jsx":"32b9a45b78c1","components/feedback/Popover.jsx":"cae4ce1cff47","components/feedback/Snackbar.jsx":"c52e99f96ec4","components/forms/Checkbox.jsx":"c1f0ec04010a","components/forms/EntryField.jsx":"83ad8ed25100","components/forms/FileSelectionRvp.jsx":"1ce87b1c02f7","components/forms/Formfield.jsx":"e9fa9c305a7f","components/forms/Radio.jsx":"a3e99ed83427","components/forms/SearchOption.jsx":"1d961c96b5ad","components/forms/Switch.jsx":"c96826a07b95","components/forms/TextArea.jsx":"df564363dd87","components/forms/TextField.jsx":"1f6440fe42b2","components/navigation/Menu.jsx":"11445adf1cc2","components/navigation/TabBar.jsx":"33bb6a66cc23","ui_kits/platform-suite/OrderDialog.jsx":"572331868091","ui_kits/platform-suite/RealmProcesses.jsx":"b1c5900ff4bf","ui_kits/platform-suite/RealmSettings.jsx":"630754e1fc96","ui_kits/platform-suite/Shell.jsx":"6139849b8da2","ui_kits/platform-suite/data.js":"b046ecd210be"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VulqanPlatformDesignSystem_5affcd = window.VulqanPlatformDesignSystem_5affcd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* mz-button — Material's ButtonBase re-registered under an mz- tag.
   Everything here is from base/Button.ts: raised is forced false in the constructor,
   `secondary` is read once at connectedCallback and flips the element to outlined,
   :host paints background-color: var(--mz-secondary) unconditionally — so an outlined
   mz-button is a secondary-filled button with a white rule around it, not a ghost. */

const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxSizing: 'border-box',
  border: 'none',
  fontFamily: 'var(--mz-font-family)',
  fontSize: 'var(--mz-fnt-sz-rem-1-4)',
  fontWeight: 'var(--mz-fnt-wght-medium)',
  textTransform: 'none',
  letterSpacing: '0.0892857143em',
  borderRadius: 'var(--mz-radius-button)',
  padding: '0 1rem',
  minWidth: '64px',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  transition: 'box-shadow 280ms cubic-bezier(.4,0,.2,1), background-color 15ms linear'
};
function Button({
  label,
  children,
  secondary = false,
  outlined = false,
  raised = false,
  dense = false,
  disabled = false,
  icon,
  trailingIcon,
  onClick,
  style,
  ...rest
}) {
  const isOutlined = outlined || secondary;
  const s = {
    ...base,
    height: dense ? '32px' : '36px',
    color: disabled ? 'rgba(0,0,0,.38)' : 'var(--mz-sm-white-color)',
    backgroundColor: disabled ? 'var(--mz-rvp-global-gray-200, #ecedef)' : 'var(--mz-secondary)',
    boxShadow: raised && !disabled ? '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)' : 'none',
    outline: isOutlined && !disabled ? '1px solid var(--mz-sm-white-color)' : 'none',
    outlineOffset: '-1px',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 1 : undefined,
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    style: s
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px'
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", null, label ?? children), trailingIcon ? /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px'
    }
  }, trailingIcon) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* mz-icon-button — IconButtonBase re-registered. --mdc-icon-button-size is set at
   69 sites and --mdc-icon-size at 170, which is the single busiest theming knob in
   the codebase: icon buttons are sized locally, not by a token. */

function IconButton({
  icon,
  size = 48,
  iconSize = 24,
  on = false,
  onIcon,
  disabled = false,
  title,
  onClick,
  style,
  ...rest
}) {
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    padding: 0,
    border: 'none',
    background: 'transparent',
    borderRadius: '50%',
    color: disabled ? 'rgba(0,0,0,.38)' : 'var(--mz-darkBlack1-lightGray-color)',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background-color 120ms linear',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    title: title,
    "aria-label": title || icon,
    disabled: disabled,
    onClick: onClick,
    style: s
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: `${iconSize}px`,
      lineHeight: 1
    }
  }, on && onIcon ? onIcon : icon));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/ToggleButtonGroup.jsx
try { (() => {
/* toggle-button-group — the one element in wc-foundations without an mz- prefix.
   A segmented control; selection is the accent, not a fill change. */

function ToggleButtonGroup({
  options = [],
  value,
  multiple = false,
  disabled = false,
  onChange,
  style
}) {
  const selected = multiple ? Array.isArray(value) ? value : [] : value;
  const isOn = v => multiple ? selected.includes(v) : selected === v;
  const pick = v => {
    if (disabled) return;
    if (!onChange) return;
    if (multiple) onChange(isOn(v) ? selected.filter(x => x !== v) : [...selected, v]);else onChange(v);
  };
  return /*#__PURE__*/React.createElement("span", {
    role: "group",
    style: {
      display: 'inline-flex',
      border: 'var(--mz-border-1)',
      borderRadius: 'var(--mz-radius-button)',
      overflow: 'hidden',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, options.map((o, i) => {
    const v = typeof o === 'string' ? o : o.value;
    const on = isOn(v);
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      onClick: () => pick(v),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '32px',
        padding: '0 12px',
        border: 'none',
        borderLeft: i ? 'var(--mz-border-1)' : 'none',
        background: on ? 'var(--mz-secondary)' : 'transparent',
        color: on ? 'var(--mz-sm-white-color)' : 'var(--mz-darkBlack1-lightGray-color)',
        fontFamily: 'var(--mz-font-family)',
        fontSize: 'var(--mz-fnt-sz-rem-1-2)',
        fontWeight: 'var(--mz-fnt-wght-medium)',
        cursor: disabled ? 'default' : 'pointer'
      }
    }, typeof o !== 'string' && o.icon ? /*#__PURE__*/React.createElement("span", {
      className: "material-icons",
      style: {
        fontSize: '16px'
      }
    }, o.icon) : null, typeof o === 'string' ? o : o.label);
  }));
}
Object.assign(__ds_scope, { ToggleButtonGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/ToggleButtonGroup.jsx", error: String((e && e.message) || e) }); }

// components/content/Caption.jsx
try { (() => {
/* mz-caption — Vulqan's own. The platform's section label: a small uppercase-free
   heading with an optional count and trailing controls. Its sizing tokens
   (--mz-caption-base-fnt-sz, --mz-caption-t2, --mz-caption-trest,
   --mz-caption-token-max-width) are four of the 52 names referenced by var() and
   declared nowhere, so the shipped element falls back to inherited type. */

function Caption({
  text,
  count,
  level = 1,
  actions,
  style
}) {
  const size = level === 1 ? 'var(--mz-fnt-sz-rem-1-7)' : level === 2 ? 'var(--mz-fnt-sz-rem-1-4)' : 'var(--mz-fnt-sz-rem-1-2)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      fontFamily: 'var(--mz-font-family)',
      fontSize: size,
      fontWeight: 'var(--mz-fnt-wght-semibold)',
      color: 'var(--mz-darkBlack1-lightGray-color)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '8px'
    }
  }, text, count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--mz-fnt-wght-regular)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, count) : null), actions);
}
Object.assign(__ds_scope, { Caption });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Caption.jsx", error: String((e && e.message) || e) }); }

// components/content/CaptionVz.jsx
try { (() => {
/* mz-caption-vz — the viewzone variant of mz-caption. Sits on the viewzone toolbar
   surface rather than on white, so it takes its colour from the accent and carries
   the record count that the metrics bar summarises. */

function CaptionVz({
  text,
  count,
  meta,
  actions,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      height: '4.8rem',
      padding: '0 1.4rem',
      background: 'var(--mz-secondary-variant)',
      borderBottom: 'var(--mz-border-1)',
      fontFamily: 'var(--mz-font-family)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-7)',
      fontWeight: 'var(--mz-fnt-wght-semibold)',
      color: 'var(--mz-secondary)'
    }
  }, text), count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-2)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, count) : null), meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: '2.2rem',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, meta.map(m => /*#__PURE__*/React.createElement("span", {
    key: m.label
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: m.color || 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, m.value), ' ', m.label))) : null, actions);
}
Object.assign(__ds_scope, { CaptionVz });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CaptionVz.jsx", error: String((e && e.message) || e) }); }

// components/content/EmptySpace.jsx
try { (() => {
/* mz-empty-space — Vulqan's own, and the smallest element in wc-foundations. Two
   jobs: a fixed rem gap between fields, or the empty state for a zone with nothing
   in it. The spacing form exists because the utility layer has no gap scale — only
   .fields-gap (margin: 3rem 0) and .gap-10 (gap: 1rem). */

function EmptySpace({
  size = '3rem',
  vertical = true,
  icon,
  message,
  style
}) {
  if (icon || message) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '4rem 1rem',
        fontFamily: 'var(--mz-font-family)',
        color: 'var(--mz-sm-gray3-color)',
        ...style
      }
    }, icon ? /*#__PURE__*/React.createElement("span", {
      className: "material-icons",
      style: {
        fontSize: '32px'
      }
    }, icon) : null, message ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--mz-fnt-sz-rem-1-4)'
      }
    }, message) : null);
  }
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'block',
      flex: '0 0 auto',
      ...(vertical ? {
        height: size
      } : {
        width: size
      }),
      ...style
    }
  });
}
Object.assign(__ds_scope, { EmptySpace });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/EmptySpace.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/* mz-dialog — DialogBase re-registered. Height comes from the density tokens
   (--mz-dialog-height-lg/xl/xxl) or from one of the .full-size-dialog utility
   classes; the ten .class-N-dlg constants that look like a size system have no CSS
   rule anywhere and never shipped. Bottom controls use .dialog-bottom-controls
   (265 uses, 256 files) — flex-end, margin 1rem. */

const SIZES = {
  lg: '72rem',
  xl: '85rem',
  xxl: '90rem'
};
function Dialog({
  open = true,
  heading,
  size = 'lg',
  width = '56rem',
  actions,
  onClose,
  children,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,.32)',
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexFlow: 'column',
      width,
      maxWidth: '92%',
      maxHeight: SIZES[size] || SIZES.lg,
      background: 'var(--mz-white-darkblack2-color)',
      borderRadius: 'var(--mz-radius-button)',
      boxShadow: '0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)',
      fontFamily: 'var(--mz-font-family)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.7rem 1rem 0.7rem 1.3rem',
      fontSize: 'var(--mz-fnt-sz-rem-1-7)',
      fontWeight: 'var(--mz-fnt-wght-semibold)',
      color: 'var(--mz-secondary)',
      background: 'var(--mz-primary-variant-light-color)',
      borderBottom: 'var(--mz-border-1)'
    }
  }, /*#__PURE__*/React.createElement("span", null, heading), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: onClose,
    style: {
      fontSize: '20px',
      cursor: 'pointer'
    }
  }, "close")), /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      overflow: 'auto',
      padding: '1.6rem 1.3rem'
    }
  }, children), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      margin: '1rem'
    }
  }, actions) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Popover.jsx
try { (() => {
/* mz-popover — Vulqan's own (BaseLit). A light anchored surface used for filter
   panels, column pickers and inline help. Unlike mz-menu it holds arbitrary content
   and has a heading slot. */

function Popover({
  open = true,
  heading,
  placement = 'bottom',
  children,
  onClose,
  style
}) {
  if (!open) return null;
  const pos = placement === 'top' ? {
    bottom: 'calc(100% + 6px)',
    left: 0
  } : placement === 'right' ? {
    left: 'calc(100% + 6px)',
    top: 0
  } : {
    top: 'calc(100% + 6px)',
    left: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      zIndex: 8,
      minWidth: '220px',
      background: 'var(--mz-white-darkblack2-color)',
      border: 'var(--mz-border-1)',
      borderRadius: 'var(--mz-radius-card)',
      boxShadow: '0 2px 10px 0 var(--mz-editzone-shadow)',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)',
      overflow: 'hidden',
      ...pos,
      ...style
    }
  }, heading ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.7rem 1rem',
      fontSize: 'var(--mz-fnt-sz-rem-1-2)',
      fontWeight: 'var(--mz-fnt-wght-semibold)',
      color: 'var(--mz-sm-gray3-color)',
      background: 'var(--mz-editzone-section-head-bg)',
      borderBottom: 'var(--mz-border-1)'
    }
  }, /*#__PURE__*/React.createElement("span", null, heading), onClose ? /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: onClose,
    style: {
      fontSize: '16px',
      cursor: 'pointer'
    }
  }, "close") : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem'
    }
  }, children));
}
Object.assign(__ds_scope, { Popover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Popover.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Snackbar.jsx
try { (() => {
/* mz-snackbar — SnackbarBase re-registered. Material's dark surface, bottom-left,
   one optional action. Not themed by --mz-* at all in the source, which is why it
   keeps Material's #333 surface rather than the accent. */

function Snackbar({
  open = true,
  message,
  action,
  onAction,
  leading = true,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '344px',
      maxWidth: '672px',
      padding: '0 8px 0 16px',
      minHeight: '48px',
      borderRadius: 'var(--mz-radius-button)',
      background: '#333333',
      color: 'rgba(255,255,255,.87)',
      boxShadow: '0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      justifyContent: leading ? 'flex-start' : 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexGrow: 1,
      padding: '14px 0'
    }
  }, message), action ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--mz-primary-variant-light-color)',
      fontFamily: 'inherit',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      fontWeight: 'var(--mz-fnt-wght-medium)',
      padding: '0 8px',
      height: '36px',
      cursor: 'pointer'
    }
  }, action) : null);
}
Object.assign(__ds_scope, { Snackbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Snackbar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/* mz-checkbox — CheckboxBase re-registered. Material's checkbox reads
   --mdc-theme-secondary for its checked fill; in this system that resolves to the
   theme accent. 18px box, 40px touch target. */

function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  style
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.38 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
      boxSizing: 'border-box',
      borderRadius: '2px',
      border: on ? 'none' : '2px solid var(--mz-sm-gray2-color)',
      background: on ? 'var(--mz-secondary)' : 'transparent',
      transition: 'background-color 90ms linear'
    }
  }, on ? /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '16px',
      color: 'var(--mz-sm-white-color)'
    }
  }, indeterminate ? 'remove' : 'check') : null));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/EntryField.jsx
try { (() => {
/* mz-entryfield — Vulqan's own (BaseLit), not a Material subclass. The platform's
   labelled data row: a caption on the left, an editable or read-only value on the
   right, sitting inside a .field-holder. Used wherever a record is shown in an
   editzone or a form dialog. */

function EntryField({
  label,
  value,
  placeholder,
  readOnly = false,
  required = false,
  invalid = false,
  labelWidth = '14rem',
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "field-holder",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minHeight: '3.2rem',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: labelWidth,
      color: 'var(--mz-sm-gray3-color)',
      fontSize: 'var(--mz-fnt-sz-rem-1-2)'
    }
  }, label, required ? ' *' : ''), readOnly ? /*#__PURE__*/React.createElement("span", {
    style: {
      flexGrow: 1,
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, value) : /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    style: {
      flexGrow: 1,
      minWidth: 0,
      height: '2.8rem',
      padding: '0 0.6rem',
      background: 'transparent',
      border: 'none',
      borderBottom: `1px solid ${invalid ? 'var(--mz-inputs-errored)' : 'var(--mz-sm-gray5-color)'}`,
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }));
}
Object.assign(__ds_scope, { EntryField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/EntryField.jsx", error: String((e && e.message) || e) }); }

// components/forms/FileSelectionRvp.jsx
try { (() => {
/* mz-file-selection-rvp — Vulqan's own, from the later "RVP" visual pass. A drop
   target plus a list of chosen files. The rvp-* family is effectively a second
   palette; this component is the clearest place it shows. */

function FileSelectionRvp({
  files = [],
  accept = 'Any file type',
  disabled = false,
  onRemove,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mz-font-family)',
      minWidth: '320px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '2rem 1rem',
      border: '1px dashed var(--mz-rvp-global-gray-400, #d4d6da)',
      borderRadius: 'var(--mz-radius-card)',
      background: 'var(--mz-rvp-global-gray-shade, #edeef0)',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '28px',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, "cloud_upload"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, "Drop files here or ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--mz-secondary)',
      cursor: 'pointer'
    }
  }, "browse")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, accept)), files.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: '3.4rem',
      padding: '0 10px',
      marginTop: '6px',
      border: 'var(--mz-border-1)',
      borderRadius: 'var(--mz-radius-button)',
      background: 'var(--mz-white-darkblack2-color)',
      fontSize: 'var(--mz-fnt-sz-rem-1-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, "description"), /*#__PURE__*/React.createElement("span", {
    style: {
      flexGrow: 1,
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, f.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--mz-sm-gray3-color)',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)'
    }
  }, f.size), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: () => onRemove && onRemove(f),
    style: {
      fontSize: '16px',
      cursor: 'pointer',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, "close"))));
}
Object.assign(__ds_scope, { FileSelectionRvp });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FileSelectionRvp.jsx", error: String((e && e.message) || e) }); }

// components/forms/Formfield.jsx
try { (() => {
/* mz-formfield — FormfieldBase re-registered. Pairs a label with a control and makes
   the label a click target. mwc-formfield also appears directly as a tag 14 times,
   which is the only Material form element that does. */

function Formfield({
  label,
  alignEnd = false,
  children,
  style
}) {
  const text = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)',
      cursor: 'pointer'
    }
  }, label);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      ...style
    }
  }, alignEnd ? text : null, children, alignEnd ? null : text);
}
Object.assign(__ds_scope, { Formfield });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Formfield.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/* mz-radio — RadioBase re-registered. Same accent source as mz-checkbox. */

function Radio({
  checked = false,
  disabled = false,
  name,
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(value),
    "data-name": name,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.38 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      boxSizing: 'border-box',
      borderRadius: '50%',
      border: `2px solid ${checked ? 'var(--mz-secondary)' : 'var(--mz-sm-gray2-color)'}`
    }
  }, checked ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: 'var(--mz-secondary)'
    }
  }) : null));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchOption.jsx
try { (() => {
/* mz-search-option — Vulqan's own. A single row in the platform's search surface:
   a leading icon, a label with the matched fragment emphasised, and an optional
   scope hint on the right. Sits on --mz-search-bg-color, which every theme repoints
   at --mz-rvp-global-gray-700. */

function SearchOption({
  icon = 'search',
  label,
  match,
  scope,
  selected = false,
  onClick,
  style
}) {
  const parts = match && label ? label.split(new RegExp(`(${match})`, 'i')) : [label];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: '3.4rem',
      padding: '0 12px',
      cursor: 'pointer',
      background: selected ? 'var(--mz-rvp-global-blue-50)' : 'transparent',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, parts.map((p, i) => match && p.toLowerCase() === match.toLowerCase() ? /*#__PURE__*/React.createElement("b", {
    key: i,
    style: {
      color: 'var(--mz-dflt-selected-activity-clr)'
    }
  }, p) : /*#__PURE__*/React.createElement("span", {
    key: i
  }, p))), scope ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, scope) : null);
}
Object.assign(__ds_scope, { SearchOption });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchOption.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/* mz-switch — SwitchBase re-registered. Material's switch: 36×14 track, 20px thumb,
   accent-coloured when on. */

function Switch({
  checked = false,
  disabled = false,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      width: '36px',
      height: '20px',
      position: 'relative',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.38 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '14px',
      borderRadius: '7px',
      background: checked ? 'var(--mz-secondary)' : 'rgba(0,0,0,.38)',
      opacity: checked ? 0.54 : 1,
      transition: 'background-color 90ms linear'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: checked ? '16px' : 0,
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: checked ? 'var(--mz-secondary)' : '#fafafa',
      boxShadow: '0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)',
      transition: 'left 90ms cubic-bezier(.4,0,.2,1), background-color 90ms linear'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextArea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* mz-textarea — TextAreaBase re-registered. Same outline treatment as mz-textfield,
   with rows driving the height instead of the dense flag. */

function TextArea({
  label,
  value,
  placeholder,
  helper,
  rows = 4,
  required = false,
  disabled = false,
  invalid = false,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? 'var(--mz-inputs-errored)' : focus ? 'var(--mz-inputs-text-focus)' : 'var(--mz-sm-gray5-color)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      minWidth: '240px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      padding: '12px',
      borderRadius: 'var(--mz-radius-button)',
      border: `${focus || invalid ? 2 : 1}px solid ${border}`,
      boxSizing: 'border-box'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '-8px',
      left: '10px',
      padding: '0 4px',
      background: 'var(--mz-white-darkblack2-color)',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: invalid ? 'var(--mz-inputs-errored)' : focus ? 'var(--mz-inputs-text-focus)' : 'var(--mz-sm-gray3-color)'
    }
  }, label, required ? ' *' : '') : null, /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      resize: 'vertical',
      background: 'transparent',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      lineHeight: 1.5,
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, rest))), helper ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: '4px',
      paddingLeft: '12px',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: invalid ? 'var(--mz-inputs-errored)' : 'var(--mz-sm-gray3-color)'
    }
  }, helper) : null);
}
Object.assign(__ds_scope, { TextArea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextArea.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* mz-textfield — TextFieldBase re-registered, themed through --mdc-text-field-*:
   idle-line-color, ink-color, label-ink-color, outlined-idle-border-color and
   outlined-hover-border-color are all fed from --mz-inputs-*. Outlined is the
   variant the platform uses; the notched outline is one of the four @vaadin/@material
   behaviours patched in production only, via npm_overrides/. */

function TextField({
  label,
  value,
  placeholder,
  helper,
  icon,
  trailingIcon,
  type = 'text',
  outlined = true,
  dense = false,
  required = false,
  disabled = false,
  invalid = false,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = dense ? 48 : 56;
  const border = invalid ? 'var(--mz-inputs-errored)' : focus ? 'var(--mz-inputs-text-focus)' : 'var(--mz-sm-gray5-color)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      minWidth: '200px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: `${h}px`,
      padding: '0 12px',
      borderRadius: 'var(--mz-radius-button)',
      border: `${focus || invalid ? 2 : 1}px solid ${border}`,
      background: disabled ? 'rgba(0,0,0,.02)' : 'transparent',
      boxSizing: 'border-box'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '-8px',
      left: '10px',
      padding: '0 4px',
      background: 'var(--mz-white-darkblack2-color)',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: invalid ? 'var(--mz-inputs-errored)' : focus ? 'var(--mz-inputs-text-focus)' : 'var(--mz-sm-gray3-color)'
    }
  }, label, required ? ' *' : '') : null, icon ? /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, icon) : null, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, rest)), trailingIcon ? /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, trailingIcon) : null), helper ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: '4px',
      paddingLeft: '12px',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      color: invalid ? 'var(--mz-inputs-errored)' : 'var(--mz-sm-gray3-color)'
    }
  }, helper) : null);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Menu.jsx
try { (() => {
/* mz-menu — MenuBase re-registered. --mdc-menu-z-index is set at 6 sites; the surface
   is Material's elevation-8 sheet. Items are mwc-list-item (69 uses, 52 files). */

function Menu({
  open = false,
  items = [],
  onSelect,
  onClose,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "menu",
    style: {
      position: 'absolute',
      zIndex: 8,
      minWidth: '160px',
      padding: '8px 0',
      background: 'var(--mz-white-darkblack2-color)',
      borderRadius: 'var(--mz-radius-button)',
      boxShadow: '0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)',
      ...style
    },
    onMouseLeave: onClose
  }, items.map((item, i) => {
    const label = typeof item === 'string' ? item : item.label;
    const icon = typeof item === 'string' ? null : item.icon;
    const divider = typeof item !== 'string' && item.divider;
    if (divider) return /*#__PURE__*/React.createElement("div", {
      key: `d${i}`,
      style: {
        height: 1,
        margin: '6px 0',
        background: 'var(--mz-rvp-global-gray-400, #d4d6da)'
      }
    });
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      role: "menuitem",
      onClick: () => onSelect && onSelect(item, i),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '32px',
        padding: '0 16px',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, icon ? /*#__PURE__*/React.createElement("span", {
      className: "material-icons",
      style: {
        fontSize: '18px',
        color: 'var(--mz-sm-gray3-color)'
      }
    }, icon) : null, label);
  }));
}
Object.assign(__ds_scope, { Menu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Menu.jsx", error: String((e && e.message) || e) }); }

// components/actions/ButtonWithMenu.jsx
try { (() => {
/* mz-button-with-menu — one of the nine Vulqan-authored elements (BaseLit, not
   Material). A split-free button that opens an mz-menu anchored to itself. */

function ButtonWithMenu({
  label,
  items = [],
  secondary = false,
  disabled = false,
  onSelect,
  style
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    label: label,
    secondary: secondary,
    disabled: disabled,
    trailingIcon: open ? 'arrow_drop_up' : 'arrow_drop_down',
    onClick: () => setOpen(v => !v)
  }), /*#__PURE__*/React.createElement(__ds_scope.Menu, {
    open: open,
    items: items,
    onSelect: (item, i) => {
      setOpen(false);
      onSelect && onSelect(item, i);
    },
    onClose: () => setOpen(false),
    style: {
      top: 'calc(100% + 2px)',
      left: 0,
      minWidth: '100%'
    }
  }));
}
Object.assign(__ds_scope, { ButtonWithMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/ButtonWithMenu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/* mz-tab-bar — TabBarBase re-registered. mwc-tab appears 24 times across 2 files, so
   the tab bar is used in exactly two places in the whole application. The viewzone tab
   strip is NOT this component — that is its own markup, reading --mz-vz-tab-*. */

function TabBar({
  tabs = [],
  value = 0,
  onChange,
  dense = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      alignItems: 'stretch',
      borderBottom: 'var(--mz-border-1)',
      fontFamily: 'var(--mz-font-family)',
      ...style
    }
  }, tabs.map((t, i) => {
    const label = typeof t === 'string' ? t : t.label;
    const icon = typeof t === 'string' ? null : t.icon;
    const active = i === value;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(i),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        height: dense ? '36px' : '48px',
        padding: '0 24px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 'var(--mz-fnt-sz-rem-1-4)',
        fontWeight: 'var(--mz-fnt-wght-medium)',
        textTransform: 'none',
        color: active ? 'var(--mz-secondary)' : 'var(--mz-sm-gray3-color)',
        boxShadow: active ? 'inset 0 -2px 0 0 var(--mz-secondary)' : 'none'
      }
    }, icon ? /*#__PURE__*/React.createElement("span", {
      className: "material-icons",
      style: {
        fontSize: '18px'
      }
    }, icon) : null, label);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform-suite/OrderDialog.jsx
try { (() => {
const {
  Dialog,
  Button,
  EntryField,
  TextArea,
  Caption,
  EmptySpace,
  TabBar,
  FileSelectionRvp,
  Formfield,
  Checkbox
} = window.VulqanPlatformDesignSystem_5affcd;

/* There is no URL router in the platform — mz-realms is a switch on an event-bus
   channel — so a dialog is how the application changes context. Every form flow is
   one of these. */

function OrderDialog({
  record,
  onClose,
  onSave
}) {
  const [tab, setTab] = React.useState(0);
  if (!record) return null;
  return /*#__PURE__*/React.createElement(Dialog, {
    heading: `Edit ${record.id}`,
    width: "64rem",
    onClose: onClose,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancel",
      secondary: true,
      onClick: onClose
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Save",
      onClick: onSave
    }))
  }, /*#__PURE__*/React.createElement(TabBar, {
    tabs: ['Detail', 'Attachments', 'History'],
    value: tab,
    onChange: setTab,
    dense: true
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.6rem"
  }), tab === 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(EntryField, {
    label: "Customer",
    value: record.customer,
    labelWidth: "18rem"
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Order value",
    value: record.value,
    labelWidth: "18rem",
    required: true
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Owner",
    value: record.owner,
    labelWidth: "18rem"
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Purchase reference",
    value: "",
    placeholder: "Required for matched orders",
    labelWidth: "18rem",
    invalid: true
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.4rem"
  }), /*#__PURE__*/React.createElement(TextArea, {
    label: "Notes",
    rows: 3,
    value: "Matched against the January remittance.",
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.2rem"
  }), /*#__PURE__*/React.createElement(Formfield, {
    label: "Notify owner on save"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: true,
    onChange: () => {}
  }))) : tab === 1 ? /*#__PURE__*/React.createElement(FileSelectionRvp, {
    accept: "CSV, XLSX, PDF up to 25 MB",
    files: [{
      name: 'remittance-jan.pdf',
      size: '412 KB'
    }],
    style: {
      width: '100%'
    }
  }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Caption, {
    level: 3,
    text: "Audit trail"
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "0.8rem"
  }), [['04 Aug 11:58', 'a.patel', 'Status changed to Matched'], ['04 Aug 10:33', 'system', 'Auto-matched against remittance 88231'], ['04 Aug 09:12', 'system', 'Received via SFTP connector']].map(r => /*#__PURE__*/React.createElement("div", {
    key: r[0],
    style: {
      display: 'flex',
      gap: '1.4rem',
      padding: '6px 0',
      borderBottom: '1px solid var(--mz-sm-gray8-color)',
      fontSize: 'var(--mz-fnt-sz-rem-1-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '11rem',
      flex: 'none',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      width: '8rem',
      flex: 'none',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, r[1]), /*#__PURE__*/React.createElement("span", null, r[2])))));
}
Object.assign(window, {
  OrderDialog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform-suite/OrderDialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform-suite/RealmProcesses.jsx
try { (() => {
const {
  CaptionVz,
  IconButton,
  ButtonWithMenu,
  Button,
  EntryField,
  Caption,
  EmptySpace,
  Popover,
  Checkbox,
  Formfield
} = window.VulqanPlatformDesignSystem_5affcd;

/* mz-standard-realm — the canonical five-zone layout: myzone rail, left workbar,
   viewzone (metrics bar + ag-Grid), viewzone toolbar, right editzone rail. */

function Grid({
  rows,
  selected,
  onSelect
}) {
  const cols = [['id', 'Order', '1.1fr'], ['customer', 'Customer', '1.4fr'], ['status', 'Status', '.9fr'], ['value', 'Value', '.8fr'], ['owner', 'Owner', '.9fr'], ['received', 'Received', '1.1fr']];
  const tpl = cols.map(c => `minmax(0, ${c[2]})`).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      overflow: 'auto',
      background: 'var(--mz-white-darkblack2-color)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: tpl,
      position: 'sticky',
      top: 0,
      background: 'var(--mz-rvp-light-table-header, #f4f4f4)',
      borderBottom: '1px solid var(--mz-sm-gray5-color)',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)',
      fontWeight: 'var(--mz-fnt-wght-semibold)',
      color: 'var(--mz-sm-gray1-color)'
    }
  }, cols.map(c => /*#__PURE__*/React.createElement("span", {
    key: c[0],
    style: {
      padding: '0 10px',
      height: 'var(--mz-ag-row-height)',
      lineHeight: 'var(--mz-ag-row-height)'
    }
  }, c[1]))), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    onClick: () => onSelect(r),
    style: {
      display: 'grid',
      gridTemplateColumns: tpl,
      borderBottom: '1px solid var(--mz-sm-gray8-color)',
      background: selected && selected.id === r.id ? 'var(--mz-rvp-global-blue-50)' : 'transparent',
      cursor: 'pointer',
      fontSize: 'var(--mz-fnt-sz-rem-1-3)'
    }
  }, cols.map(c => /*#__PURE__*/React.createElement("span", {
    key: c[0],
    style: {
      padding: '0 10px',
      height: 'var(--mz-ag-row-height)',
      lineHeight: 'var(--mz-ag-cell-line-hght)',
      color: c[0] === 'status' ? STATUS_COLOR[r.status] : 'var(--mz-darkBlack1-lightGray-color)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, r[c[0]])))));
}
function Editzone({
  record,
  onClose,
  onEdit
}) {
  if (!record) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '34rem',
      flex: '0 0 auto',
      background: 'var(--mz-white-darkblack2-color)',
      borderLeft: '1px solid var(--mz-sm-gray5-color)',
      boxShadow: '-2px 0 10px -6px var(--mz-editzone-shadow)',
      display: 'flex',
      flexFlow: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.7rem 1rem 0.7rem 1.3rem',
      background: 'var(--mz-editzone-section-head-bg)',
      borderBottom: 'var(--mz-border-1)'
    }
  }, /*#__PURE__*/React.createElement(Caption, {
    level: 2,
    text: record.id
  }), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: onClose,
    style: {
      fontSize: '18px',
      cursor: 'pointer',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, "close")), /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      overflow: 'auto',
      padding: '1.2rem 1.3rem'
    }
  }, /*#__PURE__*/React.createElement(EntryField, {
    label: "Customer",
    value: record.customer,
    readOnly: true
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Status",
    value: record.status,
    readOnly: true
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Order value",
    value: record.value,
    readOnly: true
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Owner",
    value: record.owner,
    readOnly: true
  }), /*#__PURE__*/React.createElement(EntryField, {
    label: "Received",
    value: record.received,
    readOnly: true
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.6rem"
  }), /*#__PURE__*/React.createElement(Caption, {
    level: 3,
    text: "Line items",
    count: 4
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "0.8rem"
  }), ['Pallet, euro · 120', 'Shrink wrap 500m · 12', 'Label roll A4 · 40', 'Delivery surcharge · 1'].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: '5px 0',
      borderBottom: '1px solid var(--mz-sm-gray8-color)',
      fontSize: 'var(--mz-fnt-sz-rem-1-3)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      margin: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Close",
    secondary: true,
    onClick: onClose
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Edit",
    icon: "edit",
    onClick: onEdit
  })));
}
function RealmProcesses({
  onEdit,
  onToast
}) {
  const [tab, setTab] = React.useState('Orders');
  const [selected, setSelected] = React.useState(null);
  const [myzone, setMyzone] = React.useState(false);
  const [filter, setFilter] = React.useState(false);
  const [exceptionsOnly, setExceptionsOnly] = React.useState(false);
  const rows = exceptionsOnly ? ORDERS.filter(o => o.status === 'Exception') : ORDERS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexGrow: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(MyzoneRail, {
    open: myzone,
    onToggle: () => setMyzone(!myzone)
  }), /*#__PURE__*/React.createElement(Workbar, {
    items: ['dashboard', 'account_tree', 'history'],
    active: "dashboard"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      minWidth: 0,
      display: 'flex',
      flexFlow: 'column'
    }
  }, /*#__PURE__*/React.createElement(VzTabs, {
    tabs: ['Orders', 'Exceptions', 'Audit'],
    value: tab,
    onChange: setTab,
    onAdd: () => onToast('Viewzone added')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexGrow: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      minWidth: 0,
      display: 'flex',
      flexFlow: 'column'
    }
  }, /*#__PURE__*/React.createElement(CaptionVz, {
    text: tab,
    count: `${rows.length} records`,
    meta: [{
      value: '98%',
      label: 'matched',
      color: 'var(--mz-sm-global_Green-color)'
    }, {
      value: 2,
      label: 'exceptions',
      color: 'var(--mz-sm-global_Red3-color)'
    }],
    actions: /*#__PURE__*/React.createElement(ButtonWithMenu, {
      label: "Export",
      items: ['CSV', 'XLSX'],
      onSelect: i => onToast(`Exported as ${i}`)
    })
  }), /*#__PURE__*/React.createElement(Grid, {
    rows: rows,
    selected: selected,
    onSelect: setSelected
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '6rem',
      flex: '0 0 auto',
      background: 'var(--mz-vz-toolbar-bg)',
      borderLeft: '1px solid var(--mz-sm-gray5-color)',
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
      gap: '4px',
      paddingTop: '8px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "filter_alt",
    size: 34,
    iconSize: 18,
    title: "Filter",
    onClick: () => setFilter(!filter),
    style: {
      color: filter ? 'var(--mz-secondary)' : 'var(--mz-sm-gray2-color)'
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "tune",
    size: 34,
    iconSize: 18,
    title: "Columns",
    style: {
      color: 'var(--mz-sm-gray2-color)'
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "download",
    size: 34,
    iconSize: 18,
    title: "Download",
    onClick: () => onToast('Download queued'),
    style: {
      color: 'var(--mz-sm-gray2-color)'
    }
  }), /*#__PURE__*/React.createElement(Popover, {
    open: filter,
    heading: "Filter",
    placement: "bottom",
    onClose: () => setFilter(false),
    style: {
      top: '3.6rem',
      right: '3.6rem',
      left: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Formfield, {
    label: "Exceptions only"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: exceptionsOnly,
    onChange: setExceptionsOnly
  })))))), selected ? /*#__PURE__*/React.createElement(Editzone, {
    record: selected,
    onClose: () => setSelected(null),
    onEdit: () => onEdit(selected)
  }) : /*#__PURE__*/React.createElement(Workbar, {
    items: ['edit_note', 'comment'],
    side: "right"
  }));
}
Object.assign(window, {
  RealmProcesses
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform-suite/RealmProcesses.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform-suite/RealmSettings.jsx
try { (() => {
const {
  Caption,
  Formfield,
  Radio,
  ToggleButtonGroup,
  Switch,
  EmptySpace,
  TextField,
  Button
} = window.VulqanPlatformDesignSystem_5affcd;

/* The preferences realm. Theme and density are the two runtime preferences the shell
   reads at boot (App.ts → setTheme / setDensity). Changing them here does exactly what
   Ambience.ts does: sets an attribute on the root element. */

function RealmSettings({
  theme,
  setTheme,
  density,
  setDensity,
  onToast
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      minWidth: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'var(--mz-sm-gray8-color)',
      padding: '2rem',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '92rem',
      boxSizing: 'border-box',
      margin: '0 auto',
      background: 'var(--mz-white-darkblack2-color)',
      border: 'var(--mz-border-1)',
      borderRadius: 'var(--mz-radius-card)',
      padding: '2rem'
    }
  }, /*#__PURE__*/React.createElement(Caption, {
    text: "Appearance"
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "0.4rem"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-2)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, "Twelve themes over one 38-token surface. Six accents, two chromes."), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.4rem"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '1rem'
    }
  }, THEMES.map(t => {
    const on = t.id === theme;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => setTheme(t.id),
      style: {
        cursor: 'pointer',
        border: `2px solid ${on ? 'var(--mz-secondary)' : 'var(--mz-rvp-global-gray-400, #d4d6da)'}`,
        borderRadius: 'var(--mz-radius-card)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '3.6rem',
        background: t.accent
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '2rem',
        background: t.id === 'dark' ? '#000' : parseInt(t.id.replace('bg', ''), 10) >= 7 ? '#ffffff' : '#232f34'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 8px',
        fontSize: 'var(--mz-fnt-sz-rem-1-1)',
        color: 'var(--mz-darkBlack1-lightGray-color)'
      }
    }, t.label, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--mz-font-mono)',
        fontSize: '.9rem',
        color: 'var(--mz-sm-gray3-color)'
      }
    }, t.id)));
  })), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "2.4rem"
  }), /*#__PURE__*/React.createElement(Caption, {
    text: "Density"
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "0.4rem"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-2)',
      color: 'var(--mz-sm-gray3-color)'
    }
  }, "Seven tokens. Compact halves the grid row and makes dialogs taller, because a compact grid fits more rows."), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.2rem"
  }), /*#__PURE__*/React.createElement(ToggleButtonGroup, {
    options: [{
      value: 'full',
      label: 'Full'
    }, {
      value: 'compact',
      label: 'Compact'
    }],
    value: density,
    onChange: setDensity
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "2.4rem"
  }), /*#__PURE__*/React.createElement(Caption, {
    text: "Session"
  }), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.2rem"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Default solution",
    value: "Order Intake"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Formfield, {
    label: "Auto-refresh viewzones",
    alignEnd: true
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: true,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '0.6rem'
    }
  }), /*#__PURE__*/React.createElement(Formfield, {
    label: "Confirm before deleting",
    alignEnd: true
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: false,
    onChange: () => {}
  })))), /*#__PURE__*/React.createElement(EmptySpace, {
    size: "1.8rem"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Discard",
    secondary: true
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Save preferences",
    onClick: () => onToast('Preferences saved')
  }))));
}
Object.assign(window, {
  RealmSettings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform-suite/RealmSettings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform-suite/Shell.jsx
try { (() => {
const {
  IconButton,
  SearchOption
} = window.VulqanPlatformDesignSystem_5affcd;

/* The five nested shells: mz-entry → mz-app → mz-suite → mz-realms → mz-standard-realm.
   Sizes are the SCSS literals: head 4.5rem, body calc(100vh - 4.4rem), myzone rail
   20px collapsed / 24.5rem expanded, editzone drawer 34rem, vz toolbar 6rem. */

function SuiteHead({
  realm,
  onRealm,
  solution,
  onSearch,
  searchOpen,
  query,
  setQuery
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "suite__head",
    style: {
      height: '4.5rem',
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'stretch',
      padding: '0 1.4rem',
      background: 'var(--mz-secondary)',
      color: 'var(--mz-sm-white-color)',
      position: 'relative',
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '18px',
      opacity: 0.8,
      cursor: 'pointer'
    }
  }, "arrow_back"), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      fontWeight: 700,
      letterSpacing: '-.01em'
    }
  }, "VULQAN"), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(255,255,255,.16)',
      borderRadius: '10px',
      padding: '2px 9px',
      fontSize: 'var(--mz-fnt-sz-rem-1-1)'
    }
  }, solution)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '2px',
      flexGrow: 1,
      marginLeft: '4rem'
    }
  }, REALMS.map(r => {
    const on = r === realm;
    return /*#__PURE__*/React.createElement("span", {
      key: r,
      onClick: () => onRealm(r),
      style: {
        padding: '5px 12px',
        fontSize: 'var(--mz-fnt-sz-rem-1-2)',
        cursor: 'pointer',
        borderRadius: 'var(--mz-radius-tab)',
        background: on ? 'var(--mz-primary-variant)' : 'transparent',
        opacity: on ? 1 : 0.75
      }
    }, r);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: '0 0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: onSearch,
    style: {
      fontSize: '17px',
      cursor: 'pointer'
    }
  }, "search"), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: () => onRealm('Settings'),
    style: {
      fontSize: '17px',
      cursor: 'pointer'
    }
  }, "settings"), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '17px'
    }
  }, "notifications"), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    style: {
      fontSize: '17px'
    }
  }, "menu_book"), searchOpen ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      right: 0,
      width: '32rem',
      background: 'var(--mz-white-darkblack2-color)',
      border: 'var(--mz-border-1)',
      borderRadius: 'var(--mz-radius-card)',
      boxShadow: '0 4px 14px 0 var(--mz-editzone-shadow)',
      overflow: 'hidden',
      zIndex: 9
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search records, processes, pipelines",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: '3.6rem',
      padding: '0 12px',
      border: 'none',
      borderBottom: 'var(--mz-border-1)',
      outline: 'none',
      fontFamily: 'var(--mz-font-family)',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)'
    }
  }), ORDERS.filter(o => (o.id + o.customer).toLowerCase().includes(query.toLowerCase())).slice(0, 4).map((o, i) => /*#__PURE__*/React.createElement(SearchOption, {
    key: o.id,
    icon: "receipt_long",
    label: `${o.id} ${o.customer}`,
    match: query || undefined,
    scope: "Orders",
    selected: i === 0
  }))) : null));
}
function MyzoneRail({
  open,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    style: {
      width: open ? '24.5rem' : '20px',
      flex: '0 0 auto',
      background: 'var(--mz-vz-tab-bg)',
      borderRight: '1px solid var(--mz-sm-gray5-color)',
      display: 'flex',
      alignItems: open ? 'flex-start' : 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      overflow: 'hidden',
      boxShadow: open ? '2px 0 8px -4px var(--mz-myzone-shadow)' : 'none',
      transition: 'width 150ms ease'
    }
  }, open ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1.2rem',
      width: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mz-fnt-sz-rem-1-2)',
      letterSpacing: '.1em',
      color: 'var(--mz-sm-gray3-color)',
      marginBottom: '1rem'
    }
  }, "MYZONE"), ['My open orders', 'Assigned to me', 'Recently viewed', 'Saved filters'].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      padding: '6px 0',
      fontSize: 'var(--mz-fnt-sz-rem-1-4)',
      color: 'var(--mz-darkBlack1-lightGray-color)'
    }
  }, t))) : /*#__PURE__*/React.createElement("span", {
    style: {
      writingMode: 'vertical-rl',
      fontSize: '.95rem',
      letterSpacing: '.14em',
      color: 'var(--mz-sm-gray0-color)'
    }
  }, "MYZONE"));
}
function Workbar({
  items,
  active,
  onPick,
  side = 'left'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '44px',
      flex: '0 0 auto',
      background: 'var(--mz-workbar-bg)',
      [side === 'left' ? 'borderRight' : 'borderLeft']: '1px solid var(--mz-sm-gray5-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      paddingTop: '8px'
    }
  }, items.map(i => /*#__PURE__*/React.createElement(IconButton, {
    key: i,
    icon: i,
    size: 34,
    iconSize: 19,
    title: i,
    onClick: () => onPick && onPick(i),
    style: {
      color: active === i ? 'var(--mz-secondary)' : 'var(--mz-sm-gray2-color)'
    }
  })));
}
function VzTabs({
  tabs,
  value,
  onChange,
  onAdd
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '3.4rem',
      flex: '0 0 auto',
      background: 'var(--mz-primary-variant)',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '2px',
      paddingLeft: '1.2rem'
    }
  }, tabs.map(t => {
    const on = t === value;
    return /*#__PURE__*/React.createElement("span", {
      key: t,
      onClick: () => onChange(t),
      style: {
        padding: '5px 14px',
        fontSize: 'var(--mz-fnt-sz-rem-1-2)',
        cursor: 'pointer',
        borderRadius: 'var(--mz-radius-tab)',
        background: on ? 'var(--mz-white-darkblack2-color)' : 'transparent',
        color: on ? 'var(--mz-darkBlack1-lightGray-color)' : 'var(--mz-sm-white-color)',
        opacity: on ? 1 : 0.8
      }
    }, t);
  }), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    onClick: onAdd,
    style: {
      fontSize: '16px',
      color: '#fff',
      margin: '0 0 7px 6px',
      cursor: 'pointer'
    }
  }, "add"));
}
Object.assign(window, {
  SuiteHead,
  MyzoneRail,
  Workbar,
  VzTabs
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform-suite/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform-suite/data.js
try { (() => {
const ORDERS = [{
  id: 'SO-10241',
  customer: 'Northwind Traders',
  status: 'Open',
  value: '£12,400',
  owner: 'a.patel',
  received: '04 Aug 09:12'
}, {
  id: 'SO-10242',
  customer: 'Contoso',
  status: 'Matched',
  value: '£8,910',
  owner: 'j.moreno',
  received: '04 Aug 09:41'
}, {
  id: 'SO-10243',
  customer: 'Fabrikam',
  status: 'Exception',
  value: '£2,050',
  owner: 'h.goyal',
  received: '04 Aug 10:02'
}, {
  id: 'SO-10244',
  customer: 'Tailspin Toys',
  status: 'Open',
  value: '£19,300',
  owner: 'a.patel',
  received: '04 Aug 10:18'
}, {
  id: 'SO-10245',
  customer: 'Adventure Works',
  status: 'Matched',
  value: '£4,775',
  owner: 'j.moreno',
  received: '04 Aug 10:33'
}, {
  id: 'SO-10246',
  customer: 'Litware',
  status: 'Matched',
  value: '£1,120',
  owner: 'h.goyal',
  received: '04 Aug 10:47'
}, {
  id: 'SO-10247',
  customer: 'Proseware',
  status: 'Open',
  value: '£33,890',
  owner: 'a.patel',
  received: '04 Aug 11:05'
}, {
  id: 'SO-10248',
  customer: 'Wide World',
  status: 'Exception',
  value: '£640',
  owner: 'j.moreno',
  received: '04 Aug 11:22'
}, {
  id: 'SO-10249',
  customer: 'Northwind Traders',
  status: 'Open',
  value: '£7,455',
  owner: 'h.goyal',
  received: '04 Aug 11:40'
}, {
  id: 'SO-10250',
  customer: 'Contoso',
  status: 'Matched',
  value: '£15,020',
  owner: 'a.patel',
  received: '04 Aug 11:58'
}];
const STATUS_COLOR = {
  Open: 'var(--mz-darkBlack1-lightGray-color)',
  Matched: 'var(--mz-sm-global_Green-color)',
  Exception: 'var(--mz-sm-global_Red3-color)'
};
const REALMS = ['Processes', 'Reports', 'Pipelines', 'Settings'];
const THEMES = [{
  id: 'dark',
  label: 'Dark',
  accent: '#167d7d'
}, {
  id: 'bg2',
  label: 'Amber dark',
  accent: '#ab750b'
}, {
  id: 'bg3',
  label: 'Blue dark',
  accent: '#153a89'
}, {
  id: 'bg4',
  label: 'Green dark',
  accent: '#0e5f4c'
}, {
  id: 'bg5',
  label: 'Red dark',
  accent: '#7c0a02'
}, {
  id: 'bg6',
  label: 'Purple dark',
  accent: '#4b1185'
}, {
  id: 'bg7',
  label: 'Teal light',
  accent: '#167d7d'
}, {
  id: 'bg8',
  label: 'Amber light',
  accent: '#ab750b'
}, {
  id: 'bg9',
  label: 'Blue light',
  accent: '#153a89'
}, {
  id: 'bg10',
  label: 'Green light',
  accent: '#0e5f4c'
}, {
  id: 'bg11',
  label: 'Red light',
  accent: '#7c0a02'
}, {
  id: 'bg12',
  label: 'Purple light',
  accent: '#4b1185'
}];
Object.assign(window, {
  ORDERS,
  STATUS_COLOR,
  REALMS,
  THEMES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform-suite/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ButtonWithMenu = __ds_scope.ButtonWithMenu;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ToggleButtonGroup = __ds_scope.ToggleButtonGroup;

__ds_ns.Caption = __ds_scope.Caption;

__ds_ns.CaptionVz = __ds_scope.CaptionVz;

__ds_ns.EmptySpace = __ds_scope.EmptySpace;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Popover = __ds_scope.Popover;

__ds_ns.Snackbar = __ds_scope.Snackbar;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.EntryField = __ds_scope.EntryField;

__ds_ns.FileSelectionRvp = __ds_scope.FileSelectionRvp;

__ds_ns.Formfield = __ds_scope.Formfield;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.SearchOption = __ds_scope.SearchOption;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextArea = __ds_scope.TextArea;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
