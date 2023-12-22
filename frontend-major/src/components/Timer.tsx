// import React, { useEffect, useState } from "react";

// const Timer: React.FC<{ expiryTimestamp: number }> = ({ expiryTimestamp }) => {
//   const calculateTimeLeft = () => {
//     const difference = expiryTimestamp - Date.now();
//     let timeLeft: { minutes: number; seconds: number } = { minutes: 0, seconds: 0 };

//     if (difference > 0) {
//       timeLeft = {
//         minutes: Math.floor((difference / 1000) / 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     }

//     return timeLeft;
//   };

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeLeft, expiryTimestamp]);

//   return (
//     <div>
//       Time Left: {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
//     </div>
//   );
// };

// export default Timer;
