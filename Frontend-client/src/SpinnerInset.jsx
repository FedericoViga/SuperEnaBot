function SpinnerInset() {
  return (
    <div className="mx-auto mt-14 mb-7 flex items-center justify-center min-h-50.75 gap-5">
      <div className="spinner-inset"></div>
      <span className="text-2xl">Calcolo numeri in corso...</span>
    </div>
  );
}

export default SpinnerInset;
