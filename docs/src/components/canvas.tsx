import useIsBrowser from '@docusaurus/useIsBrowser';
const CanvasComponent = () => {
  const isBrowser = useIsBrowser();
  if(!isBrowser) return <></>
};

export default CanvasComponent;
