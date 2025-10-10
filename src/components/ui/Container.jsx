export default function Container({ children, className = "", variant = "default" }) {
  const variants = {
    default: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8",
    wide: "w-full px-8 lg:px-16",
    narrow: "mx-auto max-w-2xl px-4 sm:px-6 lg:px-8",
    full: "w-full px-4 sm:px-6 lg:px-8"
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}