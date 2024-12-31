export default function Header() {
  return (
    <header
      className="mb-4 flex items-center justify-between px-2 py-1 space-x-2 md:px-4 md:py-2 md:space-x-4"
    >
      <h1 className="text-md md:text-xl font-bold"><a href="/">last.fm</a></h1>
      <nav>
        <ul className="flex items-center space-x-4">
          <li><a href="/">home</a></li>
          <li><a href="/about">about</a></li>
        </ul>
      </nav>
    </header>
  )
}

export { Header }