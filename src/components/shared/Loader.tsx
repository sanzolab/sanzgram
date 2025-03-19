function Loader({ width = 24, height = 24 }) {
  return (
    <div className="flex-center w-full">
      <img
        src="/assets/icons/loader.svg"
        alt="loader"
        width={width}
        height={height}
      />
    </div>
  );
}

export default Loader;
