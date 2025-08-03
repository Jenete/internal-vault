import { motion } from "framer-motion";
import "./styles/VaultHeader.css";

export default function VaultHeader() {
  return (
    <motion.h2
        className="vault-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        >
        <span className="vault-glow">
            <span className="vault-pulse-letter">R</span>ideLogic Vault
        </span>
        </motion.h2>

  );
}
