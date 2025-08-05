import { motion } from "framer-motion";
import "./styles/VaultHeader.css";


const team_picture = "https://firebasestorage.googleapis.com/v0/b/droppot.firebasestorage.app/o/pots%2Fridelogic-assets%2Fthe_guys_animated_ridelogic.mp4?alt=media&token=cf794525-0f0e-4ab1-b84c-7d7d79d177b4"; // Make sure this path is correct

export default function VaultHeader() {
  return (
    <div className="vault-header-wrapper">
      <motion.h2
        className="vault-title"
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="vault-glow">
          <span className="vault-pulse-letter">R</span>ideLogic Vault
        </span>
      </motion.h2>

      <motion.video
        src={team_picture}
        className="team-pic"
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0.2, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />

    </div>
  );
}
