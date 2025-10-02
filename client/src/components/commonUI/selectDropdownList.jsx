/**
 * @description: Styles for selectDropdownList component
 *               Reuseable in services page for category listing and drop down options
 * props:
 * - value: current value (string)
 * - onChange: function(value) => void
 * - options: array of option strings (allow "" for "All")
 * - placeholder: fallback label
 * - icon: optional icon component
 *  Reusable SelectDropdown using Headless UI v2 API
 * props:
 * - value: current value (string)
 * - onChange: function(value) => void
 * - options: array of option strings (allow "" for "All")
 * - placeholder: fallback label
 * - icon: optional icon component
 */

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Portal,
} from "@headlessui/react";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

const SelectDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  icon: Icon,
}) => {
  const buttonRef = useRef(null);

  // Floating UI for positioning
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
  });

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        {/* Trigger button */}
        <ListboxButton
          ref={(el) => {
            refs.setReference(el);
            buttonRef.current = el;
          }}
          className="flex items-center justify-between w-full bg-white/5 px-3 py-2 rounded-lg text-left cursor-pointer focus:outline-0"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-[var(--accent)]" />}
            <span className={value ? "text-white text-sm" : "text-gray-300"}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </ListboxButton>

        {/* Options rendered in a portal and positioned */}
        <Portal>
          <ListboxOptions
            ref={refs.setFloating}
            style={floatingStyles}
            className="max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-[#673ab7] text-white focus:outline-0 shadow-lg z-[9999] select-dropdown-scrollbar"
          >
            {options.map((option) => (
              <ListboxOption key={option || "all"} value={option}>
                {({ active }) => (
                  <span
                    className={`block px-4 py-2 cursor-pointer ${
                      active ? "bg-white/20" : ""
                    }`}
                  >
                    {option === "" ? placeholder : option}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Portal>
      </div>
    </Listbox>
  );
};

export default SelectDropdown;
