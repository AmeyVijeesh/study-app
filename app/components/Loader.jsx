import { ClockLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <ClockLoader color="#fff" size={50} />
    </div>
  );
}
