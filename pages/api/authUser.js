export default function handler(req, res) {
    if (req.method === "POST") {
      const { password } = req.body;
      if (password == process.env.DASHBOARD_PASS) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false, message: "Falsches Passwort. Bitte versuche es erneut." });
      }
    } else {
      res.status(405).json({ message: "Nur POST-Anfragen werden unterstützt." });
    }
  }