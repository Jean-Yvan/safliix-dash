


export default function Header({title,children}: {title: string; children?: React.ReactNode}) {
	return (
		<div className="flex items-center justify-between p-2 bg-[#686868]">
			<h1 className="text-2xl font-bold text-white">{title}</h1>
				{children}
		</div>
	)
}