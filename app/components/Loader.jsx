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
      <ClockLoader color="#36d7b7" size={50} />
    </div>
  );
}
