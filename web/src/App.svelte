<script>
  import { untrack } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { transl, reverseTransl } from './translator.js';

  let input = $state('');
  let mode = $state('latin-to-jav'); // 'latin-to-jav' or 'jav-to-latin'
  let output = $derived(mode === 'latin-to-jav' ? transl(input) : reverseTransl(input));

  let currentLang = $state('en'); // 'en' or 'id'

  const translations = {
    en: {
      title: "LexiJawa",
      subtitle: "Latin to Javanese Script Converter",
      latinLabel: "Latin",
      javaneseLabel: "Javanese",
      placeholderLatin: "Type here (e.g., 'mangan' or 'hanacaraka')",
      placeholderJav: "ꦠꦸꦭꦶꦱ꧀ꦤꦶꦁꦏꦺꦤꦺ (Type Javanese script here...)",
      resultPlaceholder: "Result will appear here...",
      copyBtn: "Copy Text",
      guideTitle: "Learning Guide",
      scrollDownNotice: "Scroll down for learning guide",
      scrollTopBtn: "Back to Top",
      switchMode: "Switch Mode"
    },
    id: {
      title: "LexiJawa",
      subtitle: "Ubah tulisan Latin ke Aksara Jawa",
      latinLabel: "Latin",
      javaneseLabel: "Aksara Jawa",
      placeholderLatin: "Tulis di sini (contoh: 'mangan' atau 'hanacaraka')",
      placeholderJav: "ꦠꦸꦭꦶꦱ꧀ꦤꦶꦁꦏꦺꦤ꺺 (Tulis Aksara Jawa di sini...)",
      resultPlaceholder: "Hasilnya bakal muncul di sini...",
      copyBtn: "Salin",
      guideTitle: "Yuk, Belajar Aksara Jawa!",
      scrollDownNotice: "Scroll ke bawah buat lihat panduan belajar",
      scrollTopBtn: "Balik ke Atas",
      switchMode: "Ganti Mode"
    }
  };

  const t = $derived(translations[currentLang]);

  function toggleMode() {
    const currentOutput = output;
    mode = mode === 'latin-to-jav' ? 'jav-to-latin' : 'latin-to-jav';
    input = currentOutput;
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

  let showScrollTop = $state(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      showScrollTop = window.scrollY > 400;
    });
  }

  // Multi-method Demo Logic
  let activeTab = $state('phonetic');
  // ... rest of demo logic remains same ...
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
        { in: 'ꦏ', out: 'ꦏ' }, { in: 'ꦏꦺꦴ', out: 'ꦏꦺꦴ' }, { in: 'ꦏꦺꦴꦥ', out: 'ꦏꦺꦴꦥ' }, { in: 'ꦏꦺꦴꦥꦶ', out: 'ꦺꦴꦥꦶ' }
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
    const currentExampleIdx = exampleIdx;
    const currentExample = demoExamples[currentExampleIdx];
    const currentSteps = currentExample[currentTab];
    if (!currentSteps) return;

    if (isTyping) {
      if (stepIdx < currentSteps.length) {
        demoInput = currentSteps[stepIdx].in;
        demoOutput = currentSteps[stepIdx].out;

        stepIdx++;        demoTimeout = setTimeout(runDemo, 500);
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
    // Only re-run when these change
    activeTab;
    exampleIdx;

    untrack(() => {
      clearTimeout(demoTimeout);
      stepIdx = 0;
      demoInput = '';
      demoOutput = '';
      isTyping = true;
      runDemo();
    });

    return () => {
      clearTimeout(demoTimeout);
    };
  });
</script>

<nav class="navbar">
  <div class="nav-container">
    <a href="https://honsda.github.io" class="nav-logo">honsda.github.io</a>
    <div class="lang-switch">
      <button class:active={currentLang === 'id'} on:click={() => currentLang = 'id'}>ID</button>
      <span>|</span>
      <button class:active={currentLang === 'en'} on:click={() => currentLang = 'en'}>EN</button>
    </div>
  </div>
</nav>

<main>
  <header>
    <div class="title-row">
      <h1>ꦭꦺꦏ꧀ꦱꦶꦗꦮ</h1>
      {#key currentLang}
        <span class="scroll-notice" in:fade={{ duration: 400 }}>{t.scrollDownNotice} &darr;</span>
      {/key}
    </div>
    {#key currentLang}
      <h3 in:fade={{ duration: 400 }}>{t.title}</h3>
      <p class="subtitle" in:fade={{ duration: 400 }}>{t.subtitle}</p>
    {/key}
  </header>

  <section class="converter">
    <div class="input-group">
      <label for="latin-input">{mode === 'latin-to-jav' ? t.latinLabel : t.javaneseLabel}</label>
      <textarea
        id="latin-input"
        placeholder={mode === 'latin-to-jav' ? t.placeholderLatin : t.placeholderJav}
        bind:value={input}
      ></textarea>
    </div>

    <div class="mode-switch-row">
      <button class="toggle-mode-btn" on:click={toggleMode} title={t.switchMode}>
        <span class="mode-arrow">⇅</span> {t.switchMode}
      </button>
    </div>

    <div class="input-group">
      <label for="javanese-output">{mode === 'latin-to-jav' ? t.javaneseLabel : t.latinLabel}</label>
      <div id="javanese-output" class="output-area">
        {#if output}
          <div class={mode === 'latin-to-jav' ? "javanese-text" : "latin-result-text"}>{output}</div>
        {:else}
          <span class="placeholder">{t.resultPlaceholder}</span>
        {/if}
      </div>
    </div>

    {#if output}
      <button class="copy-btn" on:click={copyToClipboard}>
        {t.copyBtn}
      </button>
    {/if}
  </section>

  <div class="guide">
    <div class="guide-header">
      <h2>{t.guideTitle}</h2>
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
        <p class="section-desc">These are the 20 fundamental characters of the Javanese script. Each represents a syllable ending in the inherent vowel "a". When arranged in order, they form a famous poem about two messengers.</p>
        <div class="alphabet-grid prominent">
          <div title="ha"><span aria-label="Aksara Jawa Ha" translate="no">ꦲ</span> ha</div>
          <div title="na"><span aria-label="Aksara Jawa Na" translate="no">ꦤ</span> na</div>
          <div title="ca"><span aria-label="Aksara Jawa Ca" translate="no">ꦕ</span> ca</div>
          <div title="ra"><span aria-label="Aksara Jawa Ra" translate="no">ꦫ</span> ra</div>
          <div title="ka"><span aria-label="Aksara Jawa Ka" translate="no">ꦏ</span> ka</div>
          <div title="da"><span aria-label="Aksara Jawa Da" translate="no">ꦢ</span> da</div>
          <div title="ta"><span aria-label="Aksara Jawa Ta" translate="no">ꦠ</span> ta</div>
          <div title="sa"><span aria-label="Aksara Jawa Sa" translate="no">ꦱ</span> sa</div>
          <div title="wa"><span aria-label="Aksara Jawa Wa" translate="no">ꦮ</span> wa</div>
          <div title="la"><span aria-label="Aksara Jawa La" translate="no">ꦭ</span> la</div>
          <div title="pa"><span aria-label="Aksara Jawa Pa" translate="no">ꦥ</span> pa</div>
          <div title="dha"><span aria-label="Aksara Jawa Dha" translate="no">ꦣ</span> dha</div>
          <div title="ja"><span aria-label="Aksara Jawa Ja" translate="no">ꦗ</span> ja</div>
          <div title="ya"><span aria-label="Aksara Jawa Ya" translate="no">ꦪ</span> ya</div>
          <div title="nya"><span aria-label="Aksara Jawa Nya" translate="no">ꦚ</span> nya</div>
          <div title="ma"><span aria-label="Aksara Jawa Ma" translate="no">ꦩ</span> ma</div>
          <div title="ga"><span aria-label="Aksara Jawa Ga" translate="no">ꦒ</span> ga</div>
          <div title="ba"><span aria-label="Aksara Jawa Ba" translate="no">ꦧ</span> ba</div>
          <div title="tha"><span aria-label="Aksara Jawa Tha" translate="no">ꦜ</span> tha</div>
          <div title="nga"><span aria-label="Aksara Jawa Nga" translate="no">ꦔ</span> nga</div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>3. Pasangan (Subscripts)</h4>
        <p>When two consonants meet without a vowel between them in the middle of a word (like the 'nd' in "pando"), the second consonant takes its <strong>Pasangan</strong> form. This form is usually written below or attached to the first consonant, effectively "killing" its inherent vowel.</p>
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
        <p>Diacritics are marks added to the base character to change its sound. They can change the vowel, add a final consonant sound, or create semi-vowels.</p>
        <div class="sandhangan-grid">
          <div class="sand-sect">
            <h5>Vowels (Swara)</h5>
            <ul>
              <li><span>ꦶ</span> <strong>Wulu:</strong> changes 'a' to 'i'</li>
              <li><span>ꦸ</span> <strong>Suku:</strong> changes 'a' to 'u'</li>
              <li><span>ꦺ</span> <strong>Taling:</strong> changes 'a' to 'é'</li>
              <li><span>ꦺꦴ</span> <strong>Taling Tarung:</strong> changes 'a' to 'o'</li>
              <li><span>ꦼ</span> <strong>Pepet:</strong> changes 'a' to 'ê'</li>
            </ul>
          </div>
          <div class="sand-sect">
            <h5>Finals (Panyigeg)</h5>
            <ul>
              <li><span>ꦃ</span> <strong>Wignyan:</strong> adds final '-h'</li>
              <li><span>ꦂ</span> <strong>Layar:</strong> adds final '-r'</li>
              <li><span>ꦁ</span> <strong>Cecak:</strong> adds final '-ng'</li>
              <li><span>꧀</span> <strong>Pangkon:</strong> mutes the vowel</li>
            </ul>
          </div>
          <div class="sand-sect">
            <h5>Semivowels</h5>
            <ul>
              <li><span>ꦿ</span> <strong>Cakra:</strong> adds medial '-r-'</li>
              <li><span>ꦾ</span> <strong>Pengkal:</strong> adds medial '-y-'</li>
              <li><span>ꦽ</span> <strong>Keret:</strong> adds medial '-rê-'</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>5. Aksara Rekan (Foreign Sounds)</h4>
        <p>Originally, Javanese lacked characters for sounds like "f", "z", or "kh". <strong>Aksara Rekan</strong> was developed to represent these sounds in loanwords (mostly from Arabic). They are formed by adding three dots (<em>cecak telu</em>) above a similar base character.</p>
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
        <p>Javanese has its own set of digits. When writing numbers, they are typically enclosed in <strong>Pada Pangkat</strong> (꧇) to distinguish them from letters, as some numerals look identical to certain alphabet characters.</p>
        <div class="alphabet-grid">
          <div><span>꧑</span> 1</div><div><span>꧒</span> 2</div><div><span>꧓</span> 3</div><div><span>꧔</span> 4</div><div><span>꧕</span> 5</div>
          <div><span>꧖</span> 6</div><div><span>꧗</span> 7</div><div><span>꧘</span> 8</div><div><span>꧙</span> 9</div><div><span>꧐</span> 0</div>
        </div>
      </div>

      <div class="guide-card full-width">
        <h4>7. Punctuations (Pratandha)</h4>
        <p>Javanese uses unique symbols for punctuation. Unlike the Latin system, these symbols often signal the structure of a poetic or prose composition.</p>
        <div class="punct-grid">
          <div class="punct-item">
            <span class="p-jav">꧈</span>
            <div class="p-info"><strong>Pada Lingsa:</strong> Functions like a <strong>Comma (,)</strong>. Used to indicate a slight pause.</div>
          </div>
          <div class="punct-item">
            <span class="p-jav">꧉</span>
            <div class="p-info"><strong>Pada Lungsi:</strong> Functions like a <strong>Period (.)</strong>. Used at the end of a sentence.</div>
          </div>
          <div class="punct-item">
            <span class="p-jav">꧇</span>
            <div class="p-info"><strong>Pada Pangkat:</strong> Functions like a <strong>Colon (:)</strong>. Used for lists or before quotes.</div>
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
              <p>Type the Latin equivalent of the sounds. The converter handles merging and diacritics automatically. This is the most intuitive method for beginners.</p>
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
        <p class="section-desc">See how different sounds and combinations are constructed using the rules above.</p>
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

  {#if showScrollTop}
    <button 
      class="scroll-top-btn" 
      on:click={scrollToTop}
      transition:fade={{ duration: 300 }}
    >
      &uarr; {t.scrollTopBtn}
    </button>
  {/if}
</main>

<footer>
  ꦭꦺꦏ꧀ꦱꦶꦗꦮ &copy; 2026 LexiJawa
</footer>

<style>
  :global(*) { box-sizing: border-box; }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #0f0f0f;
    color: #f1e5ac;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    width: 100%;
  }

  .javanese-text, [translate="no"], .p-jav, .feature-icon, .step-jav, .sand-sect li span, .rekan-item span, .ex-header span, .alphabet-grid span {
    font-family: 'Javanese Text', 'Noto Sans Javanese', serif;
  }

  .navbar {    position: sticky;
    top: 1rem;
    width: 90%;
    margin: 1rem auto 0;
    background: rgba(18, 18, 18, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid #c5a02844;
    border-radius: 12px;
    z-index: 1000;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  .nav-logo {
    color: #c5a028;
    text-decoration: none;
    font-weight: bold;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    transition: color 0.3s ease;
  }

  .nav-logo:hover {
    color: #f1e5ac;
  }

  .lang-switch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #444;
    font-size: 0.8rem;
  }

  .lang-switch button {
    background: none;
    border: none;
    color: #5c584a;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 300;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 4px;
    letter-spacing: 0.02em;
  }

  .lang-switch button:hover:not(.active) {
    color: #8e7218;
    background: rgba(197, 160, 40, 0.05);
  }

  .lang-switch button.active {
    color: #c5a028;
    font-weight: 300;
    background: rgba(197, 160, 40, 0.1);
    letter-spacing: 0.02em;
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

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .scroll-notice {
    font-size: 0.8rem;
    color: #6b6654;
    font-style: italic;
    margin-bottom: 0.8rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-5px);}
    60% {transform: translateY(-3px);}
  }
  
  h1 { 
    font-size: clamp(2rem, 8vw, 3.5rem); 
    background: linear-gradient(135deg, #c5a028 0%, #f1e5ac 50%, #8e7218 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0; 
    line-height: 1.4;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    padding: 1.5rem 0 1.2rem 0;
    overflow: visible;
    font-family: 'Javanese Text', 'Noto Sans Javanese', serif;
  }
  
  h3 { 
    font-size: clamp(0.8rem, 3vw, 1.1rem); 
    letter-spacing: 0.4em; 
    text-transform: uppercase; 
    margin: -0.6rem 0 0 1.2rem; 
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

  .mode-switch-row {
    display: flex;
    justify-content: center;
    margin: -1rem 0;
    z-index: 5;
  }

  .toggle-mode-btn {
    background: #1a1a1a;
    border: 1px solid #c5a02844;
    color: #c5a028;
    padding: 0.5rem 1.2rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }

  .toggle-mode-btn:hover {
    background: #c5a028;
    color: #0f0f0f;
    transform: scale(1.05);
  }

  .mode-arrow {
    font-size: 1rem;
  }

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

  .latin-result-text {
    font-size: clamp(1.2rem, 5vw, 1.8rem);
    line-height: 1.6;
    color: #f1e5ac;
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

  .guide-card p { color: #9e9882; line-height: 1.6; margin-top: 0; }
  .section-desc { font-size: 0.9rem; color: #9e9882; margin-bottom: 1.5rem; line-height: 1.6; }

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
    min-height: 360px;
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
    line-height: 2;
    background: linear-gradient(to bottom, #f1e5ac, #c5a028);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    min-height: 2.5em;
    padding-bottom: 2.5rem;
    display: block;
  }
  .cursor { animation: blink 0.8s infinite; color: #c5a028; display: inline-block; margin-left: 2px; font-weight: 100; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .demo-caption { font-size: 0.7rem; color: #3d3a2f; text-align: center; margin-top: 1.5rem; border-top: 1px solid #151515; padding-top: 1rem; font-style: italic; letter-spacing: 0.05em; }

  .demo-tabs { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2rem; width: 100%; }
  .demo-tabs button {
    background: #0a0a0a; 
    border: 1px solid #1a1a1a; 
    color: #5c584a;
    padding: 0.6rem 1.2rem; 
    border-radius: 6px; 
    cursor: pointer; 
    text-transform: uppercase; 
    font-size: 0.75rem; 
    letter-spacing: 0.1em; 
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    flex: 1; 
    min-width: 120px;
  }

  .demo-tabs button:hover:not(.active) { 
    border-color: #c5a02844; 
    color: #8e7218; 
    background: rgba(197, 160, 40, 0.05);
  }

  .demo-tabs button.active { 
    background: linear-gradient(135deg, #c5a028, #8e7218); 
    color: #0f0f0f; 
    font-weight: 300; 
    border-color: transparent; 
    box-shadow: 0 4px 12px rgba(197, 160, 40, 0.2); 
    transform: translateY(-2px);
  }

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

  .scroll-top-btn {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    background: rgba(18, 18, 18, 0.9);
    border: 1px solid #c5a028;
    color: #c5a028;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    z-index: 1001;
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: bold;
  }

  .scroll-top-btn:hover {
    background: #c5a028;
    color: #0f0f0f;
    transform: translateY(-5px);
  }
  </style>