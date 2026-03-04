<script>
  import { transl } from './translator.js';

  let input = $state('');
  let output = $derived(transl(input));

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

  // Multi-method Demo Logic
  let activeTab = $state('phonetic');
  let demoInput = $state('');
  let demoOutput = $state('');
  let isTyping = $state(true);
  let demoTimeout;

  const demoExamples = [
    {
      name: "mangan",
      phonetic: [
        { in: 'm', out: 'ꦩ' }, { in: 'ma', out: 'ꦩ' }, { in: 'man', out: 'ꦩꦤ' },
        { in: 'mang', out: 'ꦩꦁ' }, { in: 'manga', out: 'ꦩꦔ' }, { in: 'mangan', out: 'ꦩꦔꦤ' },
        { in: 'mangan ', out: 'ꦩꦔꦤ꧀ ' }
      ],
      windows: [
        { in: 'm', out: 'ꦩ' }, { in: 'mG', out: 'ꦩꦔ' }, { in: 'mGn', out: 'ꦩꦔꦤ' }, { in: 'mGn[', out: 'ꦩꦔꦤ꧀' }
      ],
      mobile: [
        { in: 'ꦩ', out: 'ꦩ' }, { in: 'ꦩꦔ', out: 'ꦩꦔ' }, { in: 'ꦩꦔꦤ', out: 'ꦩꦔꦤ' }, { in: 'ꦩꦔꦤ꧀', out: 'ꦩꦔꦤ꧀' }
      ]
    },
    {
      name: "buku",
      phonetic: [
        { in: 'b', out: 'ꦧ' }, { in: 'bu', out: 'ꦧꦸ' }, { in: 'buk', out: 'ꦧꦸꦏ꧀' }, { in: 'buku', out: 'ꦧꦸꦏꦸ' }
      ],
      windows: [
        { in: 'b', out: 'ꦧ' }, { in: 'bu', out: 'ꦧꦸ' }, { in: 'buk', out: 'ꦧꦸꦏ' }, { in: 'buku', out: 'ꦧꦸꦏꦸ' }
      ],
      mobile: [
        { in: 'ꦧ', out: 'ꦧ' }, { in: 'ꦧꦸ', out: 'ꦧꦸ' }, { in: 'ꦧꦸꦏ', out: 'ꦧꦸꦏ' }, { in: 'ꦧꦸꦏꦸ', out: 'ꦧꦸꦏꦸ' }
      ]
    },
    {
      name: "kopi",
      phonetic: [
        { in: 'k', out: 'ꦏ' }, { in: 'ko', out: 'ꦏꦺꦴ' }, { in: 'kop', out: 'ꦏꦺꦴꦥ꧀' }, { in: 'kopi', out: 'ꦏꦺꦴꦥꦶ' }
      ],
      windows: [
        { in: 'k', out: 'ꦏ' }, { in: 'ko', out: 'ꦏꦺꦴ' }, { in: 'kop', out: 'ꦏꦺꦴꦥ' }, { in: 'kopi', out: 'ꦏꦺꦴꦥꦶ' }
      ],
      mobile: [
        { in: 'ꦏ', out: 'ꦏ' }, { in: 'ꦏꦺꦴ', out: 'ꦏꦺꦴ' }, { in: 'ꦏꦺꦴꦥ', out: 'ꦏꦺꦴꦥ' }, { in: 'ꦏꦺꦴꦥꦶ', out: 'ꦏꦺꦴꦥꦶ' }
      ]
    },
    {
      name: "segara",
      phonetic: [
        { in: 's', out: 'ꦱ' }, { in: 'se', out: 'ꦱꦺ' }, { in: 'seg', out: 'ꦱꦺꦒ꧀' }, { in: 'sega', out: 'ꦱꦺꦒ' }, { in: 'segar', out: 'ꦱꦺꦒꦂ' }, { in: 'segara', out: 'ꦱꦺꦒꦫ' }
      ],
      windows: [
        { in: 's', out: 'ꦱ' }, { in: 'sE', out: 'ꦱꦺ' }, { in: 'sg', out: 'ꦱꦒ' }, { in: 'sgr', out: 'ꦱꦒꦫ' }
      ],
      mobile: [
        { in: 'ꦱ', out: 'ꦱ' }, { in: 'ꦱꦺ', out: 'ꦱꦺ' }, { in: 'ꦱꦺꦒ', out: 'ꦱꦺꦒ' }, { in: 'ꦱꦺꦒꦫ', out: 'ꦱꦺꦒꦫ' }
      ]
    },
    {
      name: "dhahar",
      phonetic: [
        { in: 'd', out: 'ꦢ' }, { in: 'dh', out: 'ꦣ' }, { in: 'dha', out: 'ꦣ' }, { in: 'dhah', out: 'ꦣꦃ' }, { in: 'dhaha', out: 'ꦣꦲ' }, { in: 'dhahar', out: 'ꦣꦲꦂ' }
      ],
      windows: [
        { in: 'D', out: 'ꦣ' }, { in: 'Dh', out: 'ꦣꦃ' }, { in: 'Dhr', out: 'ꦣꦂ' }
      ],
      mobile: [
        { in: 'ꦣ', out: 'ꦣ' }, { in: 'ꦣꦲ', out: 'ꦣꦲ' }, { in: 'ꦣꦲꦂ', out: 'ꦣꦲꦂ' }
      ]
    }
  ];

  let exampleIdx = $state(0);
  let stepIdx = 0;

  function runDemo() {
    const currentTab = activeTab;
    const currentExample = demoExamples[exampleIdx];
    const currentSteps = currentExample[currentTab];
    if (!currentSteps) return;

    if (isTyping) {
      if (stepIdx < currentSteps.length) {
        demoInput = currentSteps[stepIdx].in;
        demoOutput = currentSteps[stepIdx].out;
        stepIdx++;
        demoTimeout = setTimeout(runDemo, 500);
      } else {
        isTyping = false;
        demoTimeout = setTimeout(runDemo, 2000);
      }
    } else {
      if (stepIdx > 0) {
        stepIdx--;
        const showIdx = Math.max(0, stepIdx - 1);
        demoInput = currentSteps[showIdx].in;
        demoOutput = currentSteps[showIdx].out;
        demoTimeout = setTimeout(runDemo, 150);
      } else {
        clearTimeout(demoTimeout);
        demoInput = '';
        demoOutput = '';
        stepIdx = 0;
        isTyping = true;
        // Cycle to next example
        exampleIdx = (exampleIdx + 1) % demoExamples.length;
      }
    }
  }

  $effect(() => {
    // Re-initialize demo when tab or example changes
    const _tab = activeTab;
    const _ex = exampleIdx;
    clearTimeout(demoTimeout);
    stepIdx = 0;
    demoInput = '';
    demoOutput = '';
    isTyping = true;
    runDemo();

    return () => {
      clearTimeout(demoTimeout);
    };
  });
</script>

<main>
  <header>
    <h1>ꦭꦺꦏ꧀ꦱꦶꦗꦮ</h1>
    <h3>LexiJawa</h3>
    <p class="subtitle">Latin to Javanese Script Converter | Konverter Latin ke Aksara Jawa</p>
  </header>

  <section class="converter">
    <div class="input-group">
      <label for="latin-input">Latin</label>
      <textarea
        id="latin-input"
        placeholder="Type here (e.g., 'mangan' or 'hanacaraka')"
        bind:value={input}
      ></textarea>
    </div>

    <div class="input-group">
      <label for="javanese-output">Javanese</label>
      <div id="javanese-output" class="output-area">
        {#if output}
          <div class="javanese-text">{output}</div>
        {:else}
          <span class="placeholder">Result will appear here...</span>
        {/if}
      </div>
    </div>

    {#if output}
      <button class="copy-btn" on:click={copyToClipboard}>
        Copy Text
      </button>
    {/if}
  </section>

  <div class="guide">
    <div class="guide-header">
      <h2>Learning Guide</h2>
      <div class="gilded-line"></div>
    </div>

    <div class="guide-content">
      <div class="guide-card main-info">
        <h4>1. The Abugida System</h4>
        <div class="abugida-stylized">
          <p class="intro-p">Javanese uses an <strong>Abugida</strong> writing system, where the fundamental unit is a <strong>Consonant-Vowel</strong> block rather than individual letters.</p>
          
          <div class="abugida-features">
            <div class="feature-item">
              <div class="feature-icon">ꦲ</div>
              <div class="feature-text">
                <strong>Inherent Vowel</strong>
                <span>Every consonant automatically includes the vowel "a".</span>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">ꦶ</div>
              <div class="feature-text">
                <strong>Diacritics</strong>
                <span>Add marks to change or mute the inherent vowel.</span>
              </div>
            </div>
          </div>

          <div class="comparison-header">Global Comparisons</div>
          <div class="abugida-comparison">
            <div class="comp-item"><strong>Hindi:</strong> क (ka) + ि &rarr; कि (ki)</div>
            <div class="comp-item"><strong>Thai:</strong> ก (ko) + ิ &rarr; กิ (ki)</div>
            <div class="comp-item"><strong>Javanese:</strong> ꦏ (ka) + ꦶ &rarr; ꦏꦶ (ki)</div>
          </div>
        </div>
      </div>

      <div class="guide-card full-width core-alphabet">
        <h4>2. Aksara Nglegena (Core Alphabet)</h4>
        <p class="section-desc">These are the 20 fundamental characters. Each represents a syllable ending in "a". Arranged in order, they tell the legend of two messengers: <em>"There were two messengers, they had a grudge, they were equally strong, here lie their corpses."</em></p>
        <div class="alphabet-grid prominent">
          <div><span>ꦲ</span> ha</div><div><span>ꦤ</span> na</div><div><span>ꦕ</span> ca</div><div><span>ꦫ</span> ra</div><div><span>ꦏ</span> ka</div>
          <div><span>ꦢ</span> da</div><div><span>ꦠ</span> ta</div><div><span>ꦱ</span> sa</div><div><span>ꦮ</span> wa</div><div><span>ꦭ</span> la</div>
          <div><span>ꦥ</span> pa</div><div><span>ꦣ</span> dha</div><div><span>ꦗ</span> ja</div><div><span>ꦪ</span> ya</div><div><span>ꦚ</span> nya</div>
          <div><span>ꦩ</span> ma</div><div><span>ꦒ</span> ga</div><div><span>ꦧ</span> ba</div><div><span>ꦜ</span> tha</div><div><span>ꦔ</span> nga</div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>3. Pasangan (Subscripts)</h4>
        <p>When two consonants meet without a vowel between them, the second consonant takes its <strong>Pasangan</strong> form. This form is usually written below or attached to the first, effectively "killing" the inherent vowel of the preceding character.</p>
        <div class="example-box">
          <h5>Visual Demo:</h5>
          <div class="pasangan-demo">
            <div class="demo-step">
              <span class="step-jav">ꦏꦠꦤ꧀</span>
              <small>katan (Ends with Pangkon)</small>
            </div>
            <div class="demo-arrow">+ ꦠ</div>
            <div class="demo-step">
              <span class="step-jav">ꦏꦠꦤ꧀ꦠ</span>
              <small>katanta (N is muted by Pasangan T)</small>
            </div>
          </div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>4. Sandhangan (Diacritics)</h4>
        <p>Diacritics are marks added to modify the sound of a base character. They are essential for forming full words beyond the basic "a" sounds.</p>
        <div class="sandhangan-grid">
          <div class="sand-sect">
            <h5>Vowels (Swara)</h5>
            <ul>
              <li><span>ꦶ</span> <strong>Wulu:</strong> (i)</li>
              <li><span>ꦸ</span> <strong>Suku:</strong> (u)</li>
              <li><span>ꦺ</span> <strong>Taling:</strong> (é)</li>
              <li><span>ꦺꦴ</span> <strong>Taling Tarung:</strong> (o)</li>
              <li><span>ꦼ</span> <strong>Pepet:</strong> (ê)</li>
            </ul>
          </div>
          <div class="sand-sect">
            <h5>Finals (Panyigeg)</h5>
            <ul>
              <li><span>ꦃ</span> <strong>Wignyan:</strong> (-h)</li>
              <li><span>ꦂ</span> <strong>Layar:</strong> (-r)</li>
              <li><span>ꦁ</span> <strong>Cecak:</strong> (-ng)</li>
              <li><span>꧀</span> <strong>Pangkon:</strong> (Mute)</li>
            </ul>
          </div>
          <div class="sand-sect">
            <h5>Semivowels</h5>
            <ul>
              <li><span>ꦿ</span> <strong>Cakra:</strong> (-r-)</li>
              <li><span>ꦾ</span> <strong>Pengkal:</strong> (-y-)</li>
              <li><span>ꦽ</span> <strong>Keret:</strong> (-rê-)</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>5. Aksara Rekan (Foreign Sounds)</h4>
        <p> loanwords often require sounds not native to ancient Javanese. <strong>Aksara Rekan</strong> accommodates these by adding three dots above a similar base character.</p>
        <div class="rekan-tags-detailed">
          <div class="rekan-item"><span>ꦏ꦳</span> <strong>kh</strong> (from 'ka')</div>
          <div class="rekan-item"><span>ꦥ꦳</span> <strong>f/v</strong> (from 'pa')</div>
          <div class="rekan-item"><span>ꦗ꦳</span> <strong>z</strong> (from 'ja')</div>
          <div class="rekan-item"><span>ꦢ꦳</span> <strong>dz</strong> (from 'da')</div>
          <div class="rekan-item"><span>ꦒ꦳</span> <strong>gh</strong> (from 'ga')</div>
          <div class="rekan-item"><span>ꦱ꦳</span> <strong>sy</strong> (from 'sa')</div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>6. Aksara Angka (Numerals)</h4>
        <p>Javanese numerals look similar to some letters. To avoid confusion, they are typically enclosed in <strong>Pada Pangkat</strong> (꧇).</p>
        <div class="alphabet-grid">
          <div><span>꧑</span> 1</div><div><span>꧒</span> 2</div><div><span>꧓</span> 3</div><div><span>꧔</span> 4</div><div><span>꧕</span> 5</div>
          <div><span>꧖</span> 6</div><div><span>꧗</span> 7</div><div><span>꧘</span> 8</div><div><span>꧙</span> 9</div><div><span>꧐</span> 0</div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>7. Punctuations (Pratandha)</h4>
        <div class="punct-grid">
          <div class="punct-item">
            <span class="p-jav">꧈</span>
            <div class="p-info"><strong>Pada Lingsa:</strong> (Comma) Used to indicate a slight pause.</div>
          </div>
          <div class="punct-item">
            <span class="p-jav">꧉</span>
            <div class="p-info"><strong>Pada Lungsi:</strong> (Period) Used at the end of a sentence.</div>
          </div>
          <div class="punct-item">
            <span class="p-jav">꧇</span>
            <div class="p-info"><strong>Pada Pangkat:</strong> (Colon) Used for lists or numeric enclosures.</div>
          </div>
        </div>
      </div>

      <div class="guide-card full-width typing-tutorial">
        <h4>8. How to Type</h4>
        
        <div class="demo-tabs">
          <button class:active={activeTab === 'phonetic'} on:click={() => activeTab = 'phonetic'}>Phonetic</button>
          <button class:active={activeTab === 'windows'} on:click={() => activeTab = 'windows'}>Windows (IME)</button>
          <button class:active={activeTab === 'mobile'} on:click={() => activeTab = 'mobile'}>Mobile (Gboard)</button>
        </div>

        <div class="tutorial-split">
          <div class="tut-text">
            {#if activeTab === 'phonetic'}
              <p>Type the Latin equivalent of the sounds. Merging and diacritics are handled automatically. This is the recommended method for this converter.</p>
              <ul>
                <li><strong>Basic:</strong> 'ha', 'na', 'ca'...</li>
                <li><strong>Vowels:</strong> 'i', 'u', 'e', 'o', 'x' (ê)</li>
                <li><strong>Muting:</strong> Use a <em>space</em> at the end of a word to add 'Pangkon'.</li>
              </ul>
            {:else}
              <p>{activeTab === 'windows' ? 'Use the native Windows Javanese layout.' : 'Use Gboard Javanese layout on Android/iOS.'}</p>
              <ul>
                <li><strong>Direct Map:</strong> Each key maps to a specific character.</li>
                <li><strong>Pasangan:</strong> {activeTab === 'windows' ? 'Use the "[" key before the next letter.' : 'Tap the script directly or long-press for subscripts.'}</li>
              </ul>
            {/if}
          </div>
          
          <div class="live-demo-box">
            <div class="demo-display">
              <div class="demo-input-row">
                <span class="label">{activeTab === 'phonetic' ? 'Input:' : 'Keystrokes:'}</span>
                <span class="text">{demoInput}<span class="cursor">|</span></span>
              </div>
              <div class="demo-output-row">
                <span class="label">Result:</span>
                <span class="text">{demoOutput}</span>
              </div>
            </div>
            <div class="demo-caption">Interactive Demo: Typing "{demoExamples[exampleIdx].name}" ({activeTab})</div>
          </div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>9. Practical Examples</h4>
        <div class="example-grid-detailed">
          <div class="ex-detail-item">
            <div class="ex-header"><span>ꦤꦺꦒꦫ</span><strong>Negara</strong></div>
            <p>na(é) + ga + ra</p>
          </div>
          <div class="ex-detail-item">
            <div class="ex-header"><span>ꦱꦸꦫꦧꦪ</span><strong>Surabaya</strong></div>
            <p>sa(u) + ra + ba + ya</p>
          </div>
          <div class="ex-detail-item">
            <div class="ex-header"><span>ꦩꦤꦸꦱ꦳ꦶꦪ</span><strong>Manusia</strong></div>
            <p>ma + nu + sya(i) + ya</p>
          </div>
          <div class="ex-detail-item">
            <div class="ex-header"><span>ꦏꦿꦠꦺꦴꦤ꧀</span><strong>Kraton</strong></div>
            <p>ka(r) + ta(o) + n(pangkon)</p>
          </div>
          <div class="ex-detail-item">
            <div class="ex-header"><span>ꦲꦭ꧀ꦭꦺꦴ</span><strong>Hallo</strong></div>
            <p>ha + l(pangkon) + la(o)</p>
          </div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>10. Aksara Murda & Swara</h4>
        <p>Aksara Murda are honorific letters used for names, titles, and important places (similar to capitals). Aksara Swara are standalone vowel letters used when a word starts with a vowel sound in formal contexts.</p>
        <div class="rekan-tags-detailed">
          <div class="rekan-item"><span>ꦟ</span> <strong>Na Murda</strong></div>
          <div class="rekan-item"><span>ꦑ</span> <strong>Ka Murda</strong></div>
          <div class="rekan-item"><span>ꦡ</span> <strong>Ta Murda</strong></div>
          <div class="rekan-item"><span>ꦄ</span> <strong>A Swara</strong></div>
          <div class="rekan-item"><span>ꦆ</span> <strong>I Swara</strong></div>
          <div class="rekan-item"><span>ꦈ</span> <strong>U Swara</strong></div>
        </div>
      </div>
    </div>
  </div>
</main>

<footer>
  ꦭꦺꦏ꧀ꦱꦶꦗꦮ &copy; 2026 LexiJawa
</footer>

<style>
  :global(*) { box-sizing: border-box; }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background-color: #0f0f0f;
    color: #f1e5ac;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    width: 100%;
  }

  main {
    width: 100%;
    max-width: 900px;
    padding: clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 2rem);
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  header { 
    text-align: left; 
    margin-bottom: 4rem; 
    width: 100%; 
    padding-top: 1rem;
  }
  
  h1 { 
    font-size: clamp(2.5rem, 10vw, 4.2rem); 
    background: linear-gradient(135deg, #c5a028 0%, #f1e5ac 50%, #8e7218 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0; 
    line-height: 1.2;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    padding-bottom: 0.2em;
  }
  
  h3 { 
    font-size: clamp(0.8rem, 3vw, 1.1rem); 
    letter-spacing: 0.4em; 
    text-transform: uppercase; 
    margin: 0; 
    color: #8e7218;
    opacity: 0.8;
  }
  
  header p.subtitle { 
    color: #6b6654; 
    font-style: italic; 
    margin-top: 2rem; 
    font-size: clamp(0.8rem, 2.5vw, 0.95rem); 
  }

  .converter {
    background: #121212;
    padding: clamp(1rem, 5vw, 2.5rem);
    border-radius: 16px;
    border: 1px solid #c5a02822;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: clamp(2rem, 8vw, 4rem);
    position: relative;
    width: 100%;
  }

  .converter::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 16px;
    pointer-events: none;
    box-shadow: inset 0 0 20px #c5a0280a;
  }

  .input-group { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
  label { font-size: 0.75rem; color: #8e7218; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold; }
  
  textarea, .output-area {
    width: 100%;
    min-height: clamp(120px, 30vh, 160px);
    padding: clamp(0.75rem, 3vw, 1.5rem);
    background: #0a0a0a;
    border: 1px solid #2a2515;
    border-radius: 10px;
    font-size: clamp(1.1rem, 4vw, 1.3rem);
    color: #d4ccb0;
    transition: all 0.4s ease;
  }

  textarea:focus { outline: none; border-color: #c5a02844; box-shadow: 0 0 20px #c5a02811; }

  .output-area { background: #050505; word-break: break-all; display: flex; align-items: flex-start; justify-content: flex-start; border-style: solid; position: relative; overflow: hidden; }
  
  .javanese-text { 
    font-size: clamp(1.8rem, 8vw, 3.2rem); 
    line-height: 1.5; 
    background: linear-gradient(to bottom, #f1e5ac, #c5a028);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 8px rgba(197, 160, 40, 0.15));
    width: 100%;
  }
  .placeholder { color: #3d3a2f; font-style: italic; font-size: 1rem; }

  .copy-btn {
    align-self: flex-end;
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #c5a028, #8e7218);
    color: #0f0f0f;
    border: none;
    border-radius: 8px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    transition: all 0.3s ease;
  }

  .copy-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(197, 160, 40, 0.2); filter: brightness(1.1); }

  .guide { margin-top: 2rem; width: 100%; }
  .guide-header { text-align: center; margin-bottom: 3rem; }
  .guide-header h2 { color: #8e7218; text-transform: uppercase; letter-spacing: 0.4em; font-size: 1.1rem; font-weight: 300; }
  .gilded-line { height: 1px; width: 120px; margin: 1rem auto; background: linear-gradient(90deg, transparent, #c5a02844, transparent); }

  .guide-content { display: grid; grid-template-columns: 1fr; gap: 2rem; width: 100%; }
  .guide-card { background: #0f0f0f; padding: clamp(1.2rem, 5vw, 2.5rem); border-radius: 12px; border: 1px solid #c5a02811; position: relative; width: 100%; overflow: hidden; }
  
  .guide-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    border-radius: 12px;
    background: radial-gradient(circle at top left, #c5a02805, transparent 40%);
    pointer-events: none;
  }

  .full-width { grid-column: 1 / -1; }

  .section-desc { font-size: 0.9rem; color: #6b6654; margin-bottom: 1.5rem; line-height: 1.6; }

  .alphabet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: clamp(0.5rem, 2vw, 1.2rem);
    text-align: center;
    margin-top: 1.5rem;
    width: 100%;
  }

  .alphabet-grid div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0.25rem;
    background: #080808;
    border-radius: 8px;
    border: 1px solid #1a1a1a;
    transition: all 0.3s ease;
  }

  .alphabet-grid div:hover { border-color: #c5a02822; background: #0c0c0c; transform: translateY(-2px); }

  .alphabet-grid span { 
    font-size: clamp(1.5rem, 6vw, 2.5rem); 
    background: linear-gradient(180deg, #f1e5ac 0%, #c5a028 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  }

  /* Stylized Abugida */
  .abugida-stylized { display: flex; flex-direction: column; gap: 1.5rem; }
  .intro-p { font-size: 1rem; line-height: 1.7; color: #9e9882; margin: 0; }
  .abugida-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.2rem; }
  .feature-item { background: #050505; padding: 1.5rem; border-radius: 10px; border: 1px solid #1a1a1a; display: flex; align-items: center; gap: 1.2rem; box-shadow: inset 0 0 15px rgba(0,0,0,0.5); }
  .feature-icon { font-size: 2.2rem; color: #c5a028; min-width: 45px; text-align: center; filter: drop-shadow(0 0 8px #c5a02822); }
  .feature-text { display: flex; flex-direction: column; }
  .feature-text strong { color: #8e7218; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.3rem; }
  .feature-text span { font-size: 0.85rem; color: #5c584a; line-height: 1.5; }
  
  .comparison-header { font-size: 0.7rem; text-transform: uppercase; color: #3d3a2f; letter-spacing: 0.25em; border-bottom: 1px solid #1a1a1a; padding-bottom: 0.6rem; margin-top: 1rem; }
  .abugida-comparison { background: #050505; padding: 1.2rem; border-radius: 8px; border: 1px solid #151515; display: flex; flex-direction: column; gap: 0.6rem; }
  .comp-item { font-size: 0.85rem; color: #5c584a; }
  .comp-item strong { color: #8e7218; margin-right: 0.5rem; font-weight: 500; }

  .tutorial-split { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 3rem; align-items: center; margin-top: 1.5rem; width: 100%; }
  .live-demo-box { 
    background: #050505; 
    padding: 2rem; 
    border-radius: 12px; 
    border: 1px solid #c5a02818; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.4); 
    width: 100%;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .demo-display { display: flex; flex-direction: column; gap: 1.8rem; width: 100%; }
  .demo-input-row, .demo-output-row { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
  .demo-display .label { font-size: 0.6rem; text-transform: uppercase; color: #5c584a; letter-spacing: 0.15em; }
  .demo-display .text { font-size: clamp(1rem, 4vw, 1.2rem); min-height: 1.5em; color: #d4ccb0; font-family: monospace; }
  .demo-output-row .text { 
    font-size: clamp(1.5rem, 6vw, 2.4rem); 
    line-height: 1.2;
    background: linear-gradient(to bottom, #f1e5ac, #c5a028);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    min-height: 1.2em;
  }
  .cursor { animation: blink 0.8s infinite; color: #c5a028; display: inline-block; margin-left: 2px; font-weight: 100; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .demo-caption { font-size: 0.7rem; color: #3d3a2f; text-align: center; margin-top: 1.5rem; border-top: 1px solid #151515; padding-top: 1rem; font-style: italic; letter-spacing: 0.05em; }

  .demo-tabs { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2rem; width: 100%; }
  .demo-tabs button {
    background: #0a0a0a; border: 1px solid #1a1a1a; color: #5c584a;
    padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; transition: all 0.3s ease;
    flex: 1; min-width: 120px;
  }
  .demo-tabs button:hover { border-color: #c5a02822; color: #8e7218; }
  .demo-tabs button.active { background: linear-gradient(135deg, #c5a028, #8e7218); color: #0f0f0f; font-weight: 900; border-color: transparent; box-shadow: 0 4px 12px rgba(197, 160, 40, 0.2); }

  .pasangan-demo { display: flex; align-items: center; justify-content: center; gap: 2.5rem; margin-top: 1.5rem; padding: 2rem; background: #050505; border-radius: 10px; border: 1px solid #151515; flex-wrap: wrap; width: 100%; }
  .step-jav { font-size: clamp(2rem, 6vw, 2.8rem); background: linear-gradient(180deg, #f1e5ac, #c5a028); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .demo-step { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
  .demo-step small { color: #3d3a2f; font-size: 0.75rem; letter-spacing: 0.05em; }
  .demo-arrow { color: #8e7218; font-size: 1.4rem; opacity: 0.6; }

  .sandhangan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2rem; margin-top: 2rem; width: 100%; }
  .sand-sect h5 { color: #8e7218; margin: 0 0 1.2rem 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 1px solid #1a1a1a; padding-bottom: 0.6rem; }
  .sand-sect ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem; }
  .sand-sect li { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: #5c584a; }
  .sand-sect li span { font-size: 1.6rem; color: #c5a028; background: #050505; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid #151515; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }

  .rekan-tags-detailed { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1.2rem; margin-top: 1.5rem; width: 100%; }
  .rekan-item { display: flex; flex-direction: column; align-items: center; background: #080808; padding: 1.5rem 1rem; border-radius: 8px; border: 1px solid #1a1a1a; transition: all 0.3s ease; }
  .rekan-item:hover { border-color: #c5a02822; }
  .rekan-item span { font-size: 2.2rem; color: #c5a028; margin-bottom: 0.6rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  .rekan-item strong { color: #8e7218; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; }

  .punct-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1.5rem; width: 100%; }
  .punct-item { display: flex; align-items: center; gap: 2rem; background: #080808; padding: 1.5rem 2rem; border-radius: 8px; border-left: 2px solid #8e7218; transition: all 0.3s ease; }
  .punct-item:hover { background: #0c0c0c; border-left-width: 4px; }
  .p-jav { font-size: 2.8rem; color: #c5a028; min-width: 60px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  .p-info { font-size: 0.9rem; color: #5c584a; line-height: 1.6; }
  .p-info strong { color: #8e7218; letter-spacing: 0.05em; }

  .example-grid-detailed { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; width: 100%; }
  .ex-detail-item { background: #080808; padding: 1.8rem; border-radius: 12px; border: 1px solid #1a1a1a; position: relative; overflow: hidden; }
  .ex-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; border-bottom: 1px solid #151515; padding-bottom: 0.8rem; }
  .ex-header span { font-size: 2.2rem; background: linear-gradient(to bottom, #f1e5ac, #c5a028); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .ex-header strong { color: #8e7218; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.15em; font-weight: 300; }
  .ex-detail-item p { font-size: 0.8rem; color: #3d3a2f; font-family: monospace; margin: 0; }

  footer { padding: 4rem 0; text-align: center; color: #2a2821; font-size: 0.75rem; letter-spacing: 0.4em; text-transform: uppercase; }

  @media (max-width: 480px) {
    .copy-btn { width: 100%; align-self: stretch; padding: 1rem; }
    .demo-tabs button { min-width: 100%; }
    textarea, .output-area { padding: 1rem; }
    header { margin-bottom: 2.5rem; }
    h1 { padding-bottom: 0.1em; }
  }
</style>