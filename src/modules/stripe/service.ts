// import pool from "../../config/db";

// export const saveDonation = async (donation: {
//   amount: number;
//   donor_email: string;
//   streamer_id: string;
//   stripe_payment_id: string;
//   status: string;
// }) => {
//   const result = await pool.query(
//     `INSERT INTO donations
//      (amount, donor_email, streamer_id, stripe_payment_id, status)
//      VALUES ($1, $2, $3, $4, $5)
//      RETURNING *`,
//     [
//       donation.amount,
//       donation.donor_email,
//       donation.streamer_id,
//       donation.stripe_payment_id,
//       donation.status,
//     ]
//   );
//   return result.rows[0];
// };

// export const updateDonationStatus = async (
//   paymentId: string,
//   status: string
// ) => {
//   const result = await pool.query(
//     `UPDATE donations
//      SET status = $1
//      WHERE stripe_payment_id = $2
//      RETURNING *`,
//     [status, paymentId]
//   );
//   return result.rows[0];
// };
