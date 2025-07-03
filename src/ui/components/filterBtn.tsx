const FilterBtn = ({title} : {title:string}) => (
	<details className="dropdown bg-neutral">
		<summary className="btn m-1 bg-neutral">
			{title}
			<svg className="fill-current ml-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
		</summary>
		<ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
			<li><a>Item 1</a></li>
			<li><a>Item 2</a></li>
		</ul>
	</details>
);

export default FilterBtn;