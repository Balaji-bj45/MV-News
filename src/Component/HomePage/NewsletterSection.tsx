export function NewsletterSection() {
  return (
    <div className="bg-red-800/100 text-white px-6 py-10 md:py-12 rounded-lg text-center mb-10 overflow-hidden relative shadow-xl">
      <div className="relative z-10">
        <h2 className="font-display text-[24px] md:text-[28px] font-black tracking-tight mb-3">Stay Ahead of the Curve</h2>
        <p className="font-serif text-[14px] md:text-[15px] text-mv-gray-300 mb-6 max-w-[500px] mx-auto">Get exclusive political insights, breaking news, and deep analysis delivered straight to your inbox daily.</p>
        
        <form className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-[420px] mx-auto rounded overflow-hidden shadow-lg" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-4 py-3 border-none bg-white text-mv-black text-[14px] font-ui outline-none"
          />
          <button type="submit" className="bg-mv-red hover:bg-mv-red-dark text-white px-6 py-3 border-none text-[13px] font-bold tracking-wide uppercase transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    
    </div>
  );
}
