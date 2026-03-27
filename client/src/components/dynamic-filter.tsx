import React from 'react';

type FilterField =
  | { type: 'search'; name: string; placeholder?: string }
  | { type: 'select'; name: string; label?: string; options: { value: string; label: string }[] }
  | { type: 'toggle'; name: string; label?: string }
  | { type: 'range'; name: string; label?: string; min?: number; max?: number };

interface DynamicFilterProps {
  fields: FilterField[];
  filters: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
  /** Optional key identifying the current form/view (used with `formFieldMap`) */
  formKey?: string;
  /** Map of formKey -> array of field `name`s to show for that form. When provided, only those fields render. */
  formFieldMap?: Record<string, string[]>;
  /**
   * If true (default) calls `onChange` whenever a control changes.
   * If false, changes are applied only when the user clicks Apply.
   */
  applyOnChange?: boolean;
}

export default function DynamicFilter({ fields, filters, onChange, onReset, className, formKey, formFieldMap, applyOnChange = true }: DynamicFilterProps) {
  const [pending, setPending] = React.useState<Record<string, any>>(filters || {});
  const [searchValue, setSearchValue] = React.useState<string>(String(filters?.search ?? ''));

  const visibleFields = React.useMemo(() => {
    if (formKey && formFieldMap && Array.isArray(formFieldMap[formKey])) {
      const allowed = new Set(formFieldMap[formKey]);
      return fields.filter((f) => allowed.has(f.name));
    }
    return fields;
  }, [fields, formKey, formFieldMap]);

  React.useEffect(() => {
    setPending(filters || {});
    setSearchValue(String(filters?.search ?? ''));
  }, [filters]);

  // Debounce helper for search when applyOnChange is true
  React.useEffect(() => {
    if (!applyOnChange) return;
    const t = setTimeout(() => {
      onChange({ ...filters, ...pending, search: searchValue });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const updatePending = (name: string, value: any) => {
    const next = { ...pending, [name]: value };
    setPending(next);
    if (applyOnChange) {
      onChange(next);
    }
  };

  const handleReset = () => {
    setPending({});
    setSearchValue('');
    if (onReset) onReset();
    if (applyOnChange) onChange({});
  };

  const handleApply = () => {
    onChange({ ...pending, search: searchValue });
  };

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className || ''}`}>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {visibleFields.map((f) => {
          if (f.type === 'search') {
            return (
              <div key={f.name} className="flex-1">
                <label className="sr-only">{f.placeholder || 'Search'}</label>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={f.placeholder || 'Search...'}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            );
          }

          if (f.type === 'select') {
            return (
              <div key={f.name} className="w-48">
                <label className="block text-sm text-muted-foreground mb-1">{f.label || ''}</label>
                <select
                  value={pending[f.name] ?? ''}
                  onChange={(e) => updatePending(f.name, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  {Array.isArray(f.options) && f.options.length > 0 ? (
                    f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))
                  ) : (
                    <option disabled value="">No options</option>
                  )}
                </select>
              </div>
            );
          }

          if (f.type === 'toggle') {
            return (
              <div key={f.name} className="flex items-center gap-2">
                <input
                  id={f.name}
                  type="checkbox"
                  checked={!!pending[f.name]}
                  onChange={(e) => updatePending(f.name, e.target.checked)}
                  className="h-4 w-4 text-primary rounded"
                />
                <label htmlFor={f.name} className="text-sm">{f.label}</label>
              </div>
            );
          }

          if (f.type === 'range') {
            return (
              <div key={f.name} className="w-48">
                <label className="block text-sm text-muted-foreground mb-1">{f.label || ''}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pending[`${f.name}Min`] ?? ''}
                    onChange={(e) => updatePending(`${f.name}Min`, e.target.value)}
                    placeholder={String(f.min ?? '')}
                    className="w-1/2 px-2 py-1 border rounded-md"
                  />
                  <input
                    type="number"
                    value={pending[`${f.name}Max`] ?? ''}
                    onChange={(e) => updatePending(`${f.name}Max`, e.target.value)}
                    placeholder={String(f.max ?? '')}
                    className="w-1/2 px-2 py-1 border rounded-md"
                  />
                </div>
              </div>
            );
          }

          return null;
        })}

        <div className="flex gap-2 ml-auto mt-2 md:mt-0">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
            type="button"
            title="Reset filters"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-2 bg-primary text-white rounded-md hover:opacity-95"
            type="button"
            title="Apply filters"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
