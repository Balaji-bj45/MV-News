import addBannerImg from '../../assets/addbanner.png';

export function AddBanner() {
  return (
    <div className="bg-white border-b border-mv-border flex justify-center w-full py-2">
      <img src={addBannerImg} alt="Advertisement Banner" className="w-full max-w-[1100px] h-auto object-contain" />
    </div>
  );
}
