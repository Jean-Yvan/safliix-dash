type Option = { label: string; value: string };
type Props = { title: string; options?: Option[]; onSelect?: (value: string) => void; selected?: string };

const FilterBtn = ({ title, options, onSelect, selected }: Props) => {
  const items = options?.length ? options : [{ label: "Item 1", value: "1" }, { label: "Item 2", value: "2" }];

  return (
    <details className="dropdown bg-neutral">
      <summary className="btn m-1 bg-neutral">
        {title}
        <svg className="fill-current ml-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {items.map((item) => (
          <li key={item.value}>
            <button
              type="button"
              className={selected === item.value ? "active" : ""}
              onClick={() => onSelect?.(item.value)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default FilterBtn;
