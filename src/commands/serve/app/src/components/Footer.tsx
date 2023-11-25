function Footer() {
  const timeProps = {
    datetime: "2023-10-25 21:00",
  };
  return (
    <footer className="bg-sky-900/10 flex justify-center">
      <div className="container mx-auto flex gap-4 justify-between">
        <time {...timeProps}>Зроблено у 2023</time>
        <a href="https://github.com/whiteand/nlp">
          Github: <span className="font-bold">@whiteand</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
