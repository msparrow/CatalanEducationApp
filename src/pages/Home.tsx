import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="grid">
      <div className="glass card tile">
        <h3>Vocabulary: Catalan → English</h3>
        <p>Match Catalan words to their English meanings.</p>
        <Link to="/vocab/ca-en" className="btn">Play</Link>
      </div>
      <div className="glass card tile">
        <h3>Vocabulary: English → Catalan</h3>
        <p>Match English words to their Catalan translations.</p>
        <Link to="/vocab/en-ca" className="btn">Play</Link>
      </div>
      <div className="glass card tile">
        <h3>Culture, History, Cuisine & Geography</h3>
        <p>Multiple-choice quiz about Catalonia.</p>
        <Link to="/culture" className="btn">Play</Link>
      </div>
    </div>
  );
}
