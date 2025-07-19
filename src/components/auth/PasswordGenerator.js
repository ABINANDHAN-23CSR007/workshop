import React, { useState, useCallback } from 'react';
import { Lock, Copy, Check, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let characters = '';
    if (includeUppercase) characters += uppercase;
    if (includeLowercase) characters += lowercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (!characters) {
      alert('Please select at least one character type');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }

    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
    setCopied(false);
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.length >= 12) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 15;
    if (/[a-z]/.test(pass)) strength += 15;
    if (/[0-9]/.test(pass)) strength += 10;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 10;
    setStrength(Math.min(strength, 100));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    if (strength < 40) return 'strength-weak';
    if (strength < 70) return 'strength-medium';
    return 'strength-strong';
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="generator-container">
      <div className="generator-background">
        <div className="generator-bubble bubble-blue"></div>
        <div className="generator-bubble bubble-green"></div>
      </div>
      
      <div className="generator-content">
        <div className="generator-card">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} className="logout-icon" /> Logout
          </button>

          <div className="generator-header">
            <div className="generator-logo">
              <Lock className="generator-logo-icon" />
            </div>
            <h1 className="generator-title">Password Generator</h1>
            <p className="generator-subtitle">Create strong, secure passwords</p>
          </div>

          <div className="generator-form">
            <div className="password-display">
              <div className="password-value">
                {password || 'Your password will appear here'}
              </div>
              <button 
                onClick={copyToClipboard} 
                disabled={!password}
                className="copy-button"
              >
                {copied ? <Check className="icon" /> : <Copy className="icon" />}
              </button>
            </div>

            <div className="strength-meter">
              <div className="strength-label">Password Strength:</div>
              <div className="strength-bar">
                <div 
                  className={`strength-fill ${getStrengthColor()}`} 
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
              <div className="strength-value">{strength}%</div>
            </div>

            <div className="length-control">
              <label htmlFor="passwordLength" className="length-label">
                Length: {passwordLength}
              </label>
              <input
                type="range"
                id="passwordLength"
                min="4"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(e.target.value)}
                className="length-slider"
              />
            </div>

            <div className="character-options">
              <div className="option-item">
                <input
                  type="checkbox"
                  id="includeUppercase"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="option-checkbox"
                />
                <label htmlFor="includeUppercase" className="option-label">
                  Uppercase Letters (A-Z)
                </label>
              </div>
              
              <div className="option-item">
                <input
                  type="checkbox"
                  id="includeLowercase"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="option-checkbox"
                />
                <label htmlFor="includeLowercase" className="option-label">
                  Lowercase Letters (a-z)
                </label>
              </div>
              
              <div className="option-item">
                <input
                  type="checkbox"
                  id="includeNumbers"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="option-checkbox"
                />
                <label htmlFor="includeNumbers" className="option-label">
                  Numbers (0-9)
                </label>
              </div>
              
              <div className="option-item">
                <input
                  type="checkbox"
                  id="includeSymbols"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                  className="option-checkbox"
                />
                <label htmlFor="includeSymbols" className="option-label">
                  Symbols (!@#$%^&*)
                </label>
              </div>
            </div>

            <button 
              onClick={generatePassword}
              className="generate-button"
            >
              <RefreshCw className="icon" />
              Generate Password
            </button>
          </div>

          <div className="security-tips">
            <h3 className="tips-title">Password Tips:</h3>
            <ul className="tips-list">
              <li>Use at least 12 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Add numbers and symbols</li>
              <li>Avoid common words or phrases</li>
              <li>Don't reuse passwords across sites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;