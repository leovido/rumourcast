'use client';

const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-10 w-14 h-14 flex items-center justify-center bg-primary text-white rounded-full shadow-xl transition-transform duration-300 hover:scale-105 gradient-border-wrapper"
      aria-label="Back to Top"
    >
      <svg
        width="31"
        height="31"
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.8163 7.23825C19.8162 7.23828 19.8162 7.23831 19.8162 7.23835L17.9254 9.12908L20.9746 12.1783L22.8653 10.2875C22.8654 10.2875 22.8654 10.2875 22.8654 10.2874C22.924 10.2288 22.9568 10.1494 22.9568 10.0666C22.9568 9.98372 22.9239 9.90425 22.8653 9.84565L20.258 7.23835C20.258 7.23831 20.258 7.23828 20.2579 7.23825C20.1994 7.17972 20.1199 7.14685 20.0371 7.14685C19.9543 7.14685 19.8749 7.17972 19.8163 7.23825ZM19.6488 13.5041L16.5996 10.4549L5.97461 21.0799V24.1291H9.02378L19.6488 13.5041ZM18.4905 5.91232C18.9008 5.50223 19.4571 5.27185 20.0371 5.27185C20.6172 5.27185 21.1735 5.50223 21.5837 5.91232L21.5838 5.91242L24.1913 8.51992L24.1914 8.52002C24.6015 8.93024 24.8318 9.48653 24.8318 10.0666C24.8318 10.6466 24.6015 11.2029 24.1914 11.6131L24.1913 11.6132L10.075 25.7295C9.89921 25.9053 9.66075 26.0041 9.41211 26.0041H5.03711C4.51934 26.0041 4.09961 25.5843 4.09961 25.0666V20.6916C4.09961 20.4429 4.19838 20.2045 4.3742 20.0287L18.4904 5.91242L18.4905 5.91232Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default BackToTopButton;
