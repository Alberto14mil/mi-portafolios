// JavaScript para la interactividad del Hero y el scroll reveal (existente)
document.addEventListener('mousemove', (e) => {
    const heroOverlay = document.querySelector('.hero-overlay');
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    if (heroOverlay) { // Asegúrate de que el elemento exista
        heroOverlay.style.transform = `translate(${x}px, ${y}px)`;
    }
});

const sections = document.querySelectorAll('.section');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// --- Lógica del Selector de Tema y Splash Screen (existente y modificado) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const splashScreen = document.querySelector('.splash-screen'); // Puede ser null si no estamos en index.html

// Función para establecer el tema
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('websiteTheme', theme);
    // Cambiar icono del botón
    if (themeToggleBtn) { // Asegúrate de que el botón exista
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggleBtn.setAttribute('aria-label', 'Activar tema claro');
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggleBtn.setAttribute('aria-label', 'Activar tema oscuro');
        }
    }
}

// Cargar el tema guardado al cargar la página
const savedTheme = localStorage.getItem('websiteTheme') || 'light'; // Por defecto tema claro
setTheme(savedTheme);

// Event listener para el botón de cambio de tema
if (themeToggleBtn) { // Asegúrate de que el botón exista
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Animación de Typewriter al inicio (solo si splash screen existe - para index.html)
if (splashScreen) {
    const codeAnimationLines = document.querySelectorAll('.code-animation span:not(.cursor)');
    const cursor = document.querySelector('.code-animation .cursor');

    function animateCodeLines() {
        let delay = 0;
        codeAnimationLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = ''; // Limpiar el texto para escribirlo de nuevo
            line.style.visibility = 'visible'; // Asegurar que la línea sea visible

            for (let i = 0; i < text.length; i++) {
                setTimeout(() => {
                    line.textContent += text.charAt(i);
                    if (index === codeAnimationLines.length - 1 && i === text.length - 1) {
                        // Cuando la última línea ha terminado, iniciar parpadeo del cursor
                        cursor.style.animation = 'blink 0.7s infinite step-end';
                    }
                }, delay);
                delay += 50; // Velocidad de escritura (ajusta aquí para más rápido/lento)
            }
            delay += 300; // Retraso entre líneas
        });

        // Después de que la animación de escritura termine, ocultar splash screen
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            // Quitar el splash screen del DOM después de la animación de fade-out
            splashScreen.addEventListener('transitionend', () => {
                splashScreen.remove();
                document.body.style.overflow = 'auto'; // Habilitar scroll
            }, { once: true });
        }, delay + 1000); // Espera un poco más para que se vea el cursor
    }

    // Deshabilitar scroll al inicio
    document.body.style.overflow = 'hidden';

    // Iniciar la animación al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
        animateCodeLines();
    });
}


// --- Lógica del Comparador de Código (NUEVO) ---

// Datos de las tareas de programación
const programmingTasks = [
    {
        id: 'factorial',
        name: 'Calcular el Factorial de un Número',
        description: 'Implementa una función que calcule el factorial de un número entero no negativo. El factorial de un número $n$ (escrito como $n!$) es el producto de todos los enteros positivos menores o iguales a $n$. Por ejemplo, $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.',
        rawPhpCode: `<?php

function factorialPHP($n) {
    if ($n < 0) {
        return "Error: El número debe ser no negativo.";
    } else if ($n === 0 || $n === 1) {
        return 1;
    } else {
        $result = 1;
        for ($i = 2; $i <= $n; $i++) {
            $result *= $i;
        }
        return $result;
    }
}

$num1 = 5;
$num2 = 0;
$num3 = -3;

echo "Factorial de " . $num1 . ": " . factorialPHP($num1) . "<br>";
echo "Factorial de " . $num2 . ": " . factorialPHP($num2) . "<br>";
echo "Factorial de " . $num3 . ": " . factorialPHP($num3) . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para calcular el factorial en PHP</span>
<span class="keyword">function</span> <span class="function-name">factorialPHP</span>(<span class="variable">$n</span>) {
    <span class="keyword">if</span> (<span class="variable">$n</span> &lt; <span class="number">0</span>) {
        <span class="keyword">return</span> <span class="string">"Error: El número debe ser no negativo."</span>;
    } <span class="keyword">else if</span> (<span class="variable">$n</span> === <span class="number">0</span> || <span class="variable">$n</span> === <span class="number">1</span>) {
        <span class="keyword">return</span> <span class="number">1</span>;
    } <span class="keyword">else</span> {
        <span class="variable">$result</span> = <span class="number">1</span>;
        <span class="keyword">for</span> (<span class="variable">$i</span> = <span class="number">2</span>; <span class="variable">$i</span> &lt;= <span class="variable">$n</span>; <span class="variable">$i</span>++) {
            <span class="variable">$result</span> *= <span class="variable">$i</span>;
        }
        <span class="keyword">return</span> <span class="variable">$result</span>;
    }
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$num1</span> = <span class="number">5</span>;
<span class="variable">$num2</span> = <span class="number">0</span>;
<span class="variable">$num3</span> = <span class="number">-3</span>;

<span class="keyword">echo</span> <span class="string">"Factorial de "</span> . <span class="variable">$num1</span> . <span class="string">": "</span> . <span class="function-name">factorialPHP</span>(<span class="variable">$num1</span>) . <span class="string">"&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"Factorial de "</span> . <span class="variable">$num2</span> . <span class="string">": "</span> . <span class="function-name">factorialPHP</span>(<span class="variable">$num2</span>) . <span class="string">"&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"Factorial de "</span> . <span class="variable">$num3</span> . <span class="string">": "</span> . <span class="function-name">factorialPHP</span>(<span class="variable">$num3</span>) . <span class="string">"&lt;br&gt;"</span>;

<span class="keyword">?&gt;</span>`,
        phpOutput: `Factorial de 5: 120\nFactorial de 0: 1\nFactorial de -3: Error: El número debe ser no negativo.`,
        rawJsCode: `function factorialJS(n) {
    if (n < 0) {
        return "Error: El número debe ser no negativo.";
    } else if (n === 0 || n === 1) {
        return 1;
    } else {
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}

const num1 = 5;
const num2 = 0;
const num3 = -3;

console.log(\`Factorial de \${num1}: \${factorialJS(num1)}\`);
console.log(\`Factorial de \${num2}: \${factorialJS(num2)}\`);
console.log(\`Factorial de \${num3}: \${factorialJS(num3)}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para calcular el factorial en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">factorialJS</span>(<span class="variable">n</span>) {
    <span class="keyword">if</span> (<span class="variable">n</span> &lt; <span class="number">0</span>) {
        <span class="keyword">return</span> <span class="string">"Error: El número debe ser no negativo."</span>;
    } <span class="keyword">else if</span> (<span class="variable">n</span> === <span class="number">0</span> || <span class="variable">n</span> === <span class="number">1</span>) {
        <span class="keyword">return</span> <span class="number">1</span>;
    } <span class="keyword">else</span> {
        <span class="keyword">let</span> <span class="variable">result</span> = <span class="number">1</span>;
        <span class="keyword">for</span> (<span class="keyword">let</span> <span class="variable">i</span> = <span class="number">2</span>; <span class="variable">i</span> &lt;= <span class="variable">n</span>; <span class="variable">i</span>++) {
            <span class="variable">result</span> *= <span class="variable">i</span>;
        }
        <span class="keyword">return</span> <span class="variable">result</span>;
    }
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">num1</span> = <span class="number">5</span>;
<span class="keyword">const</span> <span class="variable">num2</span> = <span class="number">0</span>;
<span class="keyword">const</span> <span class="variable">num3</span> = <span class="number">-3</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Factorial de \${num1}: \${factorialJS(num1)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Factorial de \${num2}: \${factorialJS(num2)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Factorial de \${num3}: \${factorialJS(num3)}\`</span>);`,
        jsOutput: `Factorial de 5: 120\nFactorial de 0: 1\nFactorial de -3: Error: El número debe ser no negativo.`
    },
    {
        id: 'fibonacci',
        name: 'Generar Secuencia de Fibonacci',
        description: 'La secuencia de Fibonacci es una serie donde cada número es la suma de los dos anteriores, comenzando con 0 y 1. Por ejemplo: 0, 1, 1, 2, 3, 5, 8, 13, ...',
        rawPhpCode: `<?php

function fibonacciPHP($n) {
    if ($n <= 0) {
        return [];
    } else if ($n === 1) {
        return [0];
    } else {
        $sequence = [0, 1];
        for ($i = 2; $i < $n; $i++) {
            $sequence[] = $sequence[$i - 1] + $sequence[$i - 2];
        }
        return $sequence;
    }
}

$len1 = 10;
$len2 = 1;
$len3 = 0;

echo "Fibonacci de " . $len1 . " elementos: " . implode(", ", fibonacciPHP($len1)) . "<br>";
echo "Fibonacci de " . $len2 . " elemento: " . implode(", ", fibonacciPHP($len2)) . "<br>";
echo "Fibonacci de " . $len3 . " elementos: " . implode(", ", fibonacciPHP($len3)) . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para generar la secuencia de Fibonacci en PHP</span>
<span class="keyword">function</span> <span class="function-name">fibonacciPHP</span>(<span class="variable">$n</span>) {
    <span class="keyword">if</span> (<span class="variable">$n</span> &lt;= <span class="number">0</span>) {
        <span class="keyword">return</span> [];
    } <span class="keyword">else if</span> (<span class="variable">$n</span> === <span class="number">1</span>) {
        <span class="keyword">return</span> [<span class="number">0</span>];
    } <span class="keyword">else</span> {
        <span class="variable">$sequence</span> = [<span class="number">0</span>, <span class="number">1</span>];
        <span class="keyword">for</span> (<span class="variable">$i</span> = <span class="number">2</span>; <span class="variable">$i</span> &lt; <span class="variable">$n</span>; <span class="variable">$i</span>++) {
            <span class="variable">$sequence</span>[] = <span class="variable">$sequence</span>[<span class="variable">$i</span> - <span class="number">1</span>] + <span class="variable">$sequence</span>[<span class="variable">$i</span> - <span class="number">2</span>];
        }
        <span class="keyword">return</span> <span class="variable">$sequence</span>;
    }
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$len1</span> = <span class="number">10</span>;
<span class="variable">$len2</span> = <span class="number">1</span>;
<span class="variable">$len3</span> = <span class="number">0</span>;

<span class="keyword">echo</span> <span class="string">"Fibonacci de "</span> . <span class="variable">$len1</span> . <span class="string">" elementos: "</span> . <span class="function-name">implode</span>(<span class="string">", "</span>, <span class="function-name">fibonacciPHP</span>(<span class="variable">$len1</span>)) . <span class="string">"&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"Fibonacci de "</span> . <span class="variable">$len2</span> . <span class="string">" elemento: "</span> . <span class="function-name">implode</span>(<span class="string">", "</span>, <span class="function-name">fibonacciPHP</span>(<span class="variable">$len2</span>)) . <span class="string">"&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"Fibonacci de "</span> . <span class="variable">$len3</span> . <span class="string">" elementos: "</span> . <span class="function-name">implode</span>(<span class="string">", "</span>, <span class="function-name">fibonacciPHP</span>(<span class="variable">$len3</span>)) . <span class="string">"&lt;br&gt;"</span>;

<span class="keyword">?&gt;</span>`,
        phpOutput: `Fibonacci de 10 elementos: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34\nFibonacci de 1 elemento: 0\nFibonacci de 0 elementos: `,
        rawJsCode: `function fibonacciJS(n) {
    if (n <= 0) {
        return [];
    } else if (n === 1) {
        return [0];
    } else {
        let sequence = [0, 1];
        for (let i = 2; i < n; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        return sequence;
    }
}

const len1 = 10;
const len2 = 1;
const len3 = 0;

console.log(\`Fibonacci de \${len1} elementos: \${fibonacciJS(len1)}\`);
console.log(\`Fibonacci de \${len2} elemento: \${fibonacciJS(len2)}\`);
console.log(\`Fibonacci de \${len3} elementos: \${fibonacciJS(len3)}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para generar la secuencia de Fibonacci en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">fibonacciJS</span>(<span class="variable">n</span>) {
    <span class="keyword">if</span> (<span class="variable">n</span> &lt;= <span class="number">0</span>) {
        <span class="keyword">return</span> [];
    } <span class="keyword">else if</span> (<span class="variable">n</span> === <span class="number">1</span>) {
        <span class="keyword">return</span> [<span class="number">0</span>];
    } <span class="keyword">else</span> {
        <span class="keyword">let</span> <span class="variable">sequence</span> = [<span class="number">0</span>, <span class="number">1</span>];
        <span class="keyword">for</span> (<span class="keyword">let</span> <span class="variable">i</span> = <span class="number">2</span>; <span class="variable">i</span> &lt; <span class="variable">n</span>; <span class="variable">i</span>++) {
            <span class="variable">sequence</span>.<span class="method">push</span>(<span class="variable">sequence</span>[<span class="variable">i</span> - <span class="number">1</span>] + <span class="variable">sequence</span>[<span class="variable">i</span> - <span class="number">2</span>]);
        }
        <span class="keyword">return</span> <span class="variable">sequence</span>;
    }
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">len1</span> = <span class="number">10</span>;
<span class="keyword">const</span> <span class="variable">len2</span> = <span class="number">1</span>;
<span class="keyword">const</span> <span class="variable">len3</span> = <span class="number">0</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Fibonacci de \${len1} elementos: \${fibonacciJS(len1)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Fibonacci de \${len2} elemento: \${fibonacciJS(len2)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Fibonacci de \${len3} elementos: \${fibonacciJS(len3)}\`</span>);`,
        jsOutput: `Fibonacci de 10 elementos: 0,1,1,2,3,5,8,13,21,34\nFibonacci de 1 elemento: 0\nFibonacci de 0 elementos: `
    },
    {
        id: 'palindrome',
        name: 'Verificar si es un Palíndromo',
        description: 'Un palíndromo es una palabra, número o frase que se lee igual hacia adelante que hacia atrás. Ejemplos: "ana", "reconocer", "madam".',
        rawPhpCode: `<?php

function isPalindromePHP($str) {
    $cleanedStr = strtolower(preg_replace("/[^a-z0-9]/i", "", $str));
    return $cleanedStr === strrev($cleanedStr);
}

$word1 = "reconocer";
$word2 = "Hola";
$word3 = "A man, a plan, a canal: Panama";

echo "'" . $word1 . "' es palíndromo: " . (isPalindromePHP($word1) ? "Sí" : "No") . "<br>";
echo "'" . $word2 . "' es palíndromo: " . (isPalindromePHP($word2) ? "Sí" : "No") . "<br>";
echo "'" . $word3 . "' es palíndromo: " . (isPalindromePHP($word3) ? "Sí" : "No") . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para verificar si una cadena es un palíndromo en PHP</span>
<span class="keyword">function</span> <span class="function-name">isPalindromePHP</span>(<span class="variable">$str</span>) {
    <span class="variable">$cleanedStr</span> = <span class="function-name">strtolower</span>(<span class="function-name">preg_replace</span>(<span class="string">"/[^a-z0-9]/i"</span>, <span class="string">""</span>, <span class="variable">$str</span>));
    <span class="keyword">return</span> <span class="variable">$cleanedStr</span> === <span class="function-name">strrev</span>(<span class="variable">$cleanedStr</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$word1</span> = <span class="string">"reconocer"</span>;
<span class="variable">$word2</span> = <span class="string">"Hola"</span>;
<span class="variable">$word3</span> = <span class="string">"A man, a plan, a canal: Panama"</span>;

<span class="keyword">echo</span> <span class="string">"'"</span> . <span class="variable">$word1</span> . <span class="string">"' es palíndromo: "</span> . (<span class="function-name">isPalindromePHP</span>(<span class="variable">$word1</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"'"</span> . <span class="variable">$word2</span> . <span class="string">"': es palíndromo: "</span> . (<span class="function-name">isPalindromePHP</span>(<span class="variable">$word2</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"'"</span> . <span class="variable">$word3</span> . <span class="string">"': es palíndromo: "</span> . (<span class="function-name">isPalindromePHP</span>(<span class="variable">$word3</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>;

<span class="keyword">?&gt;</span>`,
        phpOutput: `'reconocer' es palíndromo: Sí\n'Hola' es palíndromo: No\n'A man, a plan, a canal: Panama' es palíndromo: Sí`,
        rawJsCode: `function isPalindromeJS(str) {
    const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanedStr === cleanedStr.split('').reverse().join('');
}

const word1 = "reconocer";
const word2 = "Hola";
const word3 = "A man, a plan, a canal: Panama";

console.log(\`'\${word1}' es palíndromo: \${isPalindromeJS(word1) ? 'Sí' : 'No'}\`);
console.log(\`'\${word2}' es palíndromo: \${isPalindromeJS(word2) ? 'Sí' : 'No'}\`);
console.log(\`'\${word3}' es palíndromo: \${isPalindromeJS(word3) ? 'Sí' : 'No'}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para verificar si una cadena es un palíndromo en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">isPalindromeJS</span>(<span class="variable">str</span>) {
    <span class="keyword">const</span> <span class="variable">cleanedStr</span> = <span class="variable">str</span>.<span class="method">toLowerCase</span>().<span class="method">replace</span>(/[^a-z0-9]/g, <span class="string">''</span>);
    <span class="keyword">return</span> <span class="variable">cleanedStr</span> === <span class="variable">cleanedStr</span>.<span class="method">split</span>(<span class="string">''</span>).<span class="method">reverse</span>().<span class="method">join</span>(<span class="string">''</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">word1</span> = <span class="string">"reconocer"</span>;
<span class="keyword">const</span> <span class="variable">word2</span> = <span class="string">"Hola"</span>;
<span class="keyword">const</span> <span class="variable">word3</span> = <span class="string">"A man, a plan, a canal: Panama"</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`'\${word1}' es palíndromo: \${isPalindromeJS(word1) ? 'Sí' : 'No'}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`'\${word2}' es palíndromo: \${isPalindromeJS(word2) ? 'Sí' : 'No'}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`'\${word3}' es palíndromo: \${isPalindromeJS(word3) ? 'Sí' : 'No'}\`</span>);`
    },
    {
        id: 'sum-array',
        name: 'Sumar Elementos de un Array',
        description: 'Calcula la suma de todos los números en un array dado. Si el array está vacío, la suma es 0.',
        rawPhpCode: `<?php

function sumArrayPHP($arr) {
    if (empty($arr)) {
        return 0;
    }
    return array_sum($arr);
}

$numbers1 = [1, 2, 3, 4, 5];
$numbers2 = [10, 20, 30];
$numbers3 = [];

echo "Suma de [1, 2, 3, 4, 5]: " . sumArrayPHP($numbers1) . "<br>";
echo "Suma de [10, 20, 30]: " . sumArrayPHP($numbers2) . "<br>";
echo "Suma de []: " . sumArrayPHP($numbers3) . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para sumar elementos de un array en PHP</span>
<span class="keyword">function</span> <span class="function-name">sumArrayPHP</span>(<span class="variable">$arr</span>) {
    <span class="keyword">if</span> (empty(<span class="variable">$arr</span>)) {
        <span class="keyword">return</span> <span class="number">0</span>;
    }
    <span class="keyword">return</span> <span class="function-name">array_sum</span>(<span class="variable">$arr</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$numbers1</span> = [<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>, <span class="number">4</span>, <span class="number">5</span>];
<span class="variable">$numbers2</span> = [<span class="number">10</span>, <span class="number">20</span>, <span class="number">30</span>];
<span class="variable">$numbers3</span> = [];

<span class="keyword">echo</span> <span class="string">"Suma de [1, 2, 3, 4, 5]: "</span> . <span class="function-name">sumArrayPHP</span>(<span class="variable">$numbers1</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: 15</span>
<span class="keyword">echo</span> <span class="string">"Suma de [10, 20, 30]: "</span> . <span class="function-name">sumArrayPHP</span>(<span class="variable">$numbers2</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: 60</span>
<span class="keyword">echo</span> <span class="string">"Suma de []: "</span> . <span class="function-name">sumArrayPHP</span>(<span class="variable">$numbers3</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: 0</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `Suma de [1, 2, 3, 4, 5]: 15\nSuma de [10, 20, 30]: 60\nSuma de []: 0`,
        rawJsCode: `function sumArrayJS(arr) {
    if (arr.length === 0) {
        return 0;
    }
    return arr.reduce((acc, current) => acc + current, 0);
}

const numbers1 = [1, 2, 3, 4, 5];
const numbers2 = [10, 20, 30];
const numbers3 = [];

console.log(\`Suma de [1, 2, 3, 4, 5]: \${sumArrayJS(numbers1)}\`);
console.log(\`Suma de [10, 20, 30]: \${sumArrayJS(numbers2)}\`);
console.log(\`Suma de []: \${sumArrayJS(numbers3)}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para sumar elementos de un array en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">sumArrayJS</span>(<span class="variable">arr</span>) {
    <span class="keyword">if</span> (<span class="variable">arr</span>.<span class="method">length</span> === <span class="number">0</span>) {
        <span class="keyword">return</span> <span class="number">0</span>;
    }
    <span class="keyword">return</span> <span class="variable">arr</span>.<span class="method">reduce</span>((<span class="variable">acc</span>, <span class="variable">current</span>) => <span class="variable">acc</span> + <span class="variable">current</span>, <span class="number">0</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">numbers1</span> = [<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>, <span class="number">4</span>, <span class="number">5</span>];
<span class="keyword">const</span> <span class="variable">numbers2</span> = [<span class="number">10</span>, <span class="number">20</span>, <span class="number">30</span>];
<span class="keyword">const</span> <span class="variable">numbers3</span> = [];

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Suma de [1, 2, 3, 4, 5]: \${sumArrayJS(numbers1)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Suma de [10, 20, 30]: \${sumArrayJS(numbers2)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Suma de []: \${sumArrayJS(numbers3)}\`</span>);`,
        jsOutput: `Suma de [1, 2, 3, 4, 5]: 15\nSuma de [10, 20, 30]: 60\nSuma de []: 0`
    },
    {
        id: 'reverse-string',
        name: 'Invertir una Cadena de Texto',
        description: 'Crea una función que tome una cadena de texto y la devuelva invertida. Por ejemplo, "hola" se convierte en "aloh".',
        rawPhpCode: `<?php

function reverseStringPHP($str) {
    return strrev($str);
}

$text1 = "Hola Mundo";
$text2 = "programacion";

echo "Invertir '" . $text1 . "': " . reverseStringPHP($text1) . "<br>";
echo "Invertir '" . $text2 . "': " . reverseStringPHP($text2) . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para invertir una cadena en PHP</span>
<span class="keyword">function</span> <span class="function-name">reverseStringPHP</span>(<span class="variable">$str</span>) {
    <span class="keyword">return</span> <span class="function-name">strrev</span>(<span class="variable">$str</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$text1</span> = <span class="string">"Hola Mundo"</span>;
<span class="variable">$text2</span> = <span class="string">"programacion"</span>;

<span class="keyword">echo</span> <span class="string">"Invertir '"</span> . <span class="variable">$text1</span> . <span class="string">"': "</span> . <span class="function-name">reverseStringPHP</span>(<span class="variable">$text1</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: odnuM aloH</span>
<span class="keyword">echo</span> <span class="string">"Invertir '"</span> . <span class="variable">$text2</span> . <span class="string">"': "</span> . <span class="function-name">reverseStringPHP</span>(<span class="variable">$text2</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: noicamargorp</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `Invertir 'Hola Mundo': odnuM aloH\nInvertir 'programacion': noicamargorp`,
        rawJsCode: `function reverseStringJS(str) {
    return str.split('').reverse().join('');
}

const text1 = "Hola Mundo";
const text2 = "programacion";

console.log(\`Invertir '\${text1}': \${reverseStringJS(text1)}\`);
console.log(\`Invertir '\${text2}': \${reverseStringJS(text2)}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para invertir una cadena en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">reverseStringJS</span>(<span class="variable">str</span>) {
    <span class="keyword">return</span> <span class="variable">str</span>.<span class="method">split</span>(<span class="string">''</span>).<span class="method">reverse</span>().<span class="method">join</span>(<span class="string">''</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">text1</span> = <span class="string">"Hola Mundo"</span>;
<span class="keyword">const</span> <span class="variable">text2</span> = <span class="string">"programacion"</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Invertir '\${text1}': \${reverseStringJS(text1)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Invertir '\${text2}': \${reverseStringJS(text2)}\`</span>);`,
        jsOutput: `Invertir 'Hola Mundo': odnuM aloH\nInvertir 'programacion': noicamargorp`
    },
    {
        id: 'find-element',
        name: 'Buscar Elemento en un Array',
        description: 'Escribe una función que determine si un elemento específico existe dentro de un array. Debe devolver `true` si lo encuentra, `false` en caso contrario.',
        rawPhpCode: `<?php

function findElementPHP($arr, $element) {
    return in_array($element, $arr);
}

$fruits = ["manzana", "banana", "cereza"];

echo "¿'banana' está en el array?: " . (findElementPHP($fruits, "banana") ? "Sí" : "No") . "<br>";
echo "¿'uva' está en el array?: " . (findElementPHP($fruits, "uva") ? "Sí" : "No") . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para buscar un elemento en un array en PHP</span>
<span class="keyword">function</span> <span class="function-name">findElementPHP</span>(<span class="variable">$arr</span>, <span class="variable">$element</span>) {
    <span class="keyword">return</span> <span class="function-name">in_array</span>(<span class="variable">$element</span>, <span class="variable">$arr</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$fruits</span> = [<span class="string">"manzana"</span>, <span class="string">"banana"</span>, <span class="string">"cereza"</span>];

<span class="keyword">echo</span> <span class="string">"¿'banana' está en el array?: "</span> . (<span class="function-name">findElementPHP</span>(<span class="variable">$fruits</span>, <span class="string">"banana"</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: Sí</span>
<span class="keyword">echo</span> <span class="string">"¿'uva' está en el array?: "</span> . (<span class="function-name">findElementPHP</span>(<span class="variable">$fruits</span>, <span class="string">"uva"</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: No</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `¿'banana' está en el array?: Sí\n¿'uva' está en el array?: No`,
        rawJsCode: `function findElementJS(arr, element) {
    return arr.includes(element);
}

const fruits = ["manzana", "banana", "cereza"];

console.log(\`¿'banana' está en el array?: \${findElementJS(fruits, 'banana') ? 'Sí' : 'No'}\`);
console.log(\`¿'uva' está en el array?: \${findElementJS(fruits, 'uva') ? 'Sí' : 'No'}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para buscar un elemento en un array en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">findElementJS</span>(<span class="variable">arr</span>, <span class="variable">element</span>) {
    <span class="keyword">return</span> <span class="variable">arr</span>.<span class="method">includes</span>(<span class="variable">element</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">fruits</span> = [<span class="string">"manzana"</span>, <span class="string">"banana"</span>, <span class="string">"cereza"</span>];

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`¿'banana' está en el array?: \${findElementJS(fruits, 'banana') ? 'Sí' : 'No'}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`¿'uva' está en el array?: \${findElementJS(fruits, 'uva') ? 'Sí' : 'No'}\`</span>);`,
        jsOutput: `¿'banana' está en el array?: Sí\n¿'uva' está en el array?: No`
    },
    {
        id: 'count-vowels',
        name: 'Contar Vocales en una Cadena',
        description: 'Desarrolla una función que cuente el número de vocales (a, e, i, o, u, mayúsculas y minúsculas) en una cadena de texto dada.',
        rawPhpCode: `<?php

function countVowelsPHP($str) {
    $vowels = ['a', 'e', 'i', 'o', 'u'];
    $count = 0;
    $lowerStr = strtolower($str);
    for ($i = 0; $i < strlen($lowerStr); $i++) {
        if (in_array($lowerStr[$i], $vowels)) {
            $count++;
        }
    }
    return $count;
}

$text1 = "Programacion";
$text2 = "AEIOU";

echo "Vocales en '" . $text1 . "': " . countVowelsPHP($text1) . "<br>";
echo "Vocales en '" . $text2 . "': " . countVowelsPHP($text2) . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para contar vocales en una cadena en PHP</span>
<span class="keyword">function</span> <span class="function-name">countVowelsPHP</span>(<span class="variable">$str</span>) {
    <span class="variable">$vowels</span> = [<span class="string">'a'</span>, <span class="string">'e'</span>, <span class="string">'i'</span>, <span class="string">'o'</span>, <span class="string">'u'</span>];
    <span class="variable">$count</span> = <span class="number">0</span>;
    <span class="variable">$lowerStr</span> = <span class="function-name">strtolower</span>(<span class="variable">$str</span>);
    <span class="keyword">for</span> (<span class="variable">$i</span> = <span class="number">0</span>; <span class="variable">$i</span> &lt; <span class="function-name">strlen</span>(<span class="variable">$lowerStr</span>); <span class="variable">$i</span>++) {
        <span class="keyword">if</span> (<span class="function-name">in_array</span>(<span class="variable">$lowerStr</span>[<span class="variable">$i</span>], <span class="variable">$vowels</span>)) {
            <span class="variable">$count</span>++;
        }
    }
    <span class="keyword">return</span> <span class="variable">$count</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$text1</span> = <span class="string">"Programacion"</span>;
<span class="variable">$text2</span> = <span class="string">"AEIOU"</span>;

<span class="keyword">echo</span> <span class="string">"Vocales en '"</span> . <span class="variable">$text1</span> . <span class="string">"': "</span> . <span class="function-name">countVowelsPHP</span>(<span class="variable">$text1</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: 5</span>
<span class="keyword">echo</span> <span class="string">"Vocales en '"</span> . <span class="variable">$text2</span> . <span class="string">"': "</span> . <span class="function-name">countVowelsPHP</span>(<span class="variable">$text2</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: 5</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `Vocales en 'Programacion': 5\nVocales en 'AEIOU': 5`,
        rawJsCode: `function countVowelsJS(str) {
    const matches = str.toLowerCase().match(/[aeiou]/g);
    return matches ? matches.length : 0;
}

const text1 = "Programacion";
const text2 = "AEIOU";

console.log(\`Vocales en '\${text1}': \${countVowelsJS(text1)}\`);
console.log(\`Vocales en '\${text2}': \${countVowelsJS(text2)}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para contar vocales en una cadena en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">countVowelsJS</span>(<span class="variable">str</span>) {
    <span class="keyword">const</span> <span class="variable">matches</span> = <span class="variable">str</span>.<span class="method">toLowerCase</span>().<span class="method">match</span>(/[aeiou]/g);
    <span class="keyword">return</span> <span class="variable">matches</span> ? <span class="variable">matches</span>.<span class="method">length</span> : <span class="number">0</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">text1</span> = <span class="string">"Programacion"</span>;
<span class="keyword">const</span> <span class="variable">text2</span> = <span class="string">"AEIOU"</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Vocales en '\${text1}': \${countVowelsJS(text1)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Vocales en '\${text2}': \${countVowelsJS(text2)}\`</span>);`,
        jsOutput: `Vocales en 'Programacion': 5\nVocales en 'AEIOU': 5`
    },
    {
        id: 'is-prime',
        name: 'Verificar si un Número es Primo',
        description: 'Determina si un número entero positivo es primo. Un número primo es un número natural mayor que 1 que no tiene divisores positivos más que 1 y él mismo.',
        rawPhpCode: `<?php

function isPrimePHP($num) {
    if ($num <= 1) {
        return false;
    }
    for ($i = 2; $i * $i <= $num; $i++) {
        if ($num % $i === 0) {
            return false;
        }
    }
    return true;
}

$number1 = 7;
$number2 = 10;
$number3 = 29;

echo "¿" . $number1 . " es primo?: " . (isPrimePHP($number1) ? "Sí" : "No") . "<br>";
echo "¿" . $number2 . " es primo?: " . (isPrimePHP($number2) ? "Sí" : "No") . "<br>";
echo "¿" . $number3 . " es primo?: " . (isPrimePHP($number3) ? "Sí" : "No") . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para verificar si un número es primo en PHP</span>
<span class="keyword">function</span> <span class="function-name">isPrimePHP</span>(<span class="variable">$num</span>) {
    <span class="keyword">if</span> (<span class="variable">$num</span> &lt;= <span class="number">1</span>) {
        <span class="keyword">return</span> <span class="keyword">false</span>;
    }
    <span class="keyword">for</span> (<span class="variable">$i</span> = <span class="number">2</span>; <span class="variable">$i</span> * <span class="variable">$i</span> &lt;= <span class="variable">$num</span>; <span class="variable">$i</span>++) {
        <span class="keyword">if</span> (<span class="variable">$num</span> % <span class="variable">$i</span> === <span class="number">0</span>) {
            <span class="keyword">return</span> <span class="keyword">false</span>;
        }
    }
    <span class="keyword">return</span> <span class="keyword">true</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$number1</span> = <span class="number">7</span>;
<span class="variable">$number2</span> = <span class="number">10</span>;
<span class="variable">$number3</span> = <span class="number">29</span>;

<span class="keyword">echo</span> <span class="string">"¿"</span> . <span class="variable">$number1</span> . <span class="string">" es primo?: "</span> . (<span class="function-name">isPrimePHP</span>(<span class="variable">$number1</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: Sí</span>
<span class="keyword">echo</span> <span class="string">"¿"</span> . <span class="variable">$number2</span> . <span class="string">" es primo?: "</span> . (<span class="function-name">isPrimePHP</span>(<span class="variable">$number2</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: No</span>
<span class="keyword">echo</span> <span class="variable">$number3</span> . <span class="string">" es primo?: "</span> . (<span class="function-name">isPrimePHP</span>(<span class="variable">$number3</span>) ? <span class="string">"Sí"</span> : <span class="string">"No"</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: Sí</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `¿7 es primo?: Sí\n¿10 es primo?: No\n¿29 es primo?: Sí`,
        rawJsCode: `function isPrimeJS(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

const number1 = 7;
const number2 = 10;
const number3 = 29;

console.log(\`¿\${number1} es primo?: \${isPrimeJS(number1) ? 'Sí' : 'No'}\`);
console.log(\`¿\${number2} es primo?: \${isPrimeJS(number2) ? 'Sí' : 'No'}\`);
console.log(\`¿\${number3} es primo?: \${isPrimeJS(number3) ? 'Sí' : 'No'}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para verificar si un número es primo en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">isPrimeJS</span>(<span class="variable">num</span>) {
    <span class="keyword">if</span> (<span class="variable">num</span> &lt;= <span class="number">1</span>) {
        <span class="keyword">return</span> <span class="keyword">false</span>;
    }
    <span class="keyword">for</span> (<span class="keyword">let</span> <span class="variable">i</span> = <span class="number">2</span>; <span class="variable">i</span> * <span class="variable">i</span> &lt;= <span class="variable">num</span>; <span class="variable">i</span>++) {
        <span class="keyword">if</span> (<span class="variable">num</span> % <span class="variable">i</span> === <span class="number">0</span>) {
            <span class="keyword">return</span> <span class="keyword">false</span>;
        }
    }
    <span class="keyword">return</span> <span class="keyword">true</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">number1</span> = <span class="number">7</span>;
<span class="keyword">const</span> <span class="variable">number2</span> = <span class="number">10</span>;
<span class="keyword">const</span> <span class="variable">number3</span> = <span class="number">29</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`¿\${number1} es primo?: \${isPrimeJS(number1) ? 'Sí' : 'No'}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`¿\${number2} es primo?: \${isPrimeJS(number2) ? 'Sí' : 'No'}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`¿\${number3} es primo?: \${isPrimeJS(number3) ? 'Sí' : 'No'}\`</span>);`,
        jsOutput: `¿7 es primo?: Sí\n¿10 es primo?: No\n¿29 es primo?: Sí`
    },
    {
        id: 'celsius-to-fahrenheit',
        name: 'Convertir Celsius a Fahrenheit',
        description: 'Convierte una temperatura de grados Celsius a grados Fahrenheit. La fórmula es $F = C \\times 9/5 + 32$.',
        rawPhpCode: `<?php

function celsiusToFahrenheitPHP($celsius) {
    return ($celsius * 9 / 5) + 32;
}

$temp1 = 0;
$temp2 = 25;
$temp3 = 100;

echo $temp1 . "°C son " . celsiusToFahrenheitPHP($temp1) . "°F<br>";
echo $temp2 . "°C son " . celsiusToFahrenheitPHP($temp2) . "°F<br>";
echo $temp3 . "°C son " . celsiusToFahrenheitPHP($temp3) . "°F<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para convertir Celsius a Fahrenheit en PHP</span>
<span class="keyword">function</span> <span class="function-name">celsiusToFahrenheitPHP</span>(<span class="variable">$celsius</span>) {
    <span class="keyword">return</span> (<span class="variable">$celsius</span> * <span class="number">9</span> / <span class="number">5</span>) + <span class="number">32</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$temp1</span> = <span class="number">0</span>;
<span class="variable">$temp2</span> = <span class="number">25</span>;
<span class="variable">$temp3</span> = <span class="number">100</span>;

<span class="keyword">echo</span> <span class="variable">$temp1</span> . <span class="string">"°C son "</span> . <span class="function-name">celsiusToFahrenheitPHP</span>(<span class="variable">$temp1</span>) . <span class="string">"°F&lt;br&gt;"</span>; <span class="comment">// Salida: 32</span>
<span class="keyword">echo</span> <span class="variable">$temp2</span> . <span class="string">"°C son "</span> . <span class="function-name">celsiusToFahrenheitPHP</span>(<span class="variable">$temp2</span>) . <span class="string">"°F&lt;br&gt;"</span>; <span class="comment">// Salida: 77</span>
<span class="keyword">echo</span> <span class="variable">$temp3</span> . <span class="string">"°C son "</span> . <span class="function-name">celsiusToFahrenheitPHP</span>(<span class="variable">$temp3</span>) . <span class="string">"°F&lt;br&gt;"</span>; <span class="comment">// Salida: 212</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `0°C son 32°F\n25°C son 77°F\n100°C son 212°F`,
        rawJsCode: `function celsiusToFahrenheitJS(celsius) {
    return (celsius * 9 / 5) + 32;
}

const temp1 = 0;
const temp2 = 25;
const temp3 = 100;

console.log(\`\${temp1}°C son \${celsiusToFahrenheitJS(temp1)}°F\`);
console.log(\`\${temp2}°C son \${celsiusToFahrenheitJS(temp2)}°F\`);
console.log(\`\${temp3}°C son \${celsiusToFahrenheitJS(temp3)}°F\`);`,
        jsCodeDisplay: `<span class="comment">// Función para convertir Celsius a Fahrenheit en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">celsiusToFahrenheitJS</span>(<span class="variable">celsius</span>) {
    <span class="keyword">return</span> (<span class="variable">celsius</span> * <span class="number">9</span> / <span class="number">5</span>) + <span class="number">32</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">temp1</span> = <span class="number">0</span>;
<span class="keyword">const</span> <span class="variable">temp2</span> = <span class="number">25</span>;
<span class="keyword">const</span> <span class="variable">temp3</span> = <span class="number">100</span>;

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`\${temp1}°C son \${celsiusToFahrenheitJS(temp1)}°F\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`\${temp2}°C son \${celsiusToFahrenheitJS(temp2)}°F\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`\${temp3}°C son \${celsiusToFahrenheitJS(temp3)}°F\`</span>);`,
        jsOutput: `0°C son 32°F\n25°C son 77°F\n100°C son 212°F`
    },
    {
        id: 'find-max-array',
        name: 'Encontrar el Número Más Grande en un Array',
        description: 'Escribe una función que encuentre y devuelva el número más grande en un array de números. Si el array está vacío, debe devolver un mensaje de error o un valor nulo.',
        rawPhpCode: `<?php

function findMaxArrayPHP($arr) {
    if (empty($arr)) {
        return "Error: El array no puede estar vacío.";
    }
    return max($arr);
}

$numbers1 = [10, 5, 20, 15];
$numbers2 = [-1, -5, -2];
$numbers3 = [];

echo "El número más grande en [10, 5, 20, 15] es: " . findMaxArrayPHP($numbers1) . "<br>";
echo "El número más grande en [-1, -5, -2] es: " . findMaxArrayPHP($numbers2) . "<br>";
echo "El número más grande en []: " . findMaxArrayPHP($numbers3) . "<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para encontrar el número más grande en un array en PHP</span>
<span class="keyword">function</span> <span class="function-name">findMaxArrayPHP</span>(<span class="variable">$arr</span>) {
    <span class="keyword">if</span> (empty(<span class="variable">$arr</span>)) {
        <span class="keyword">return</span> <span class="string">"Error: El array no puede estar vacío."</span>;
    }
    <span class="keyword">return</span> <span class="function-name">max</span>(<span class="variable">$arr</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$numbers1</span> = [<span class="number">10</span>, <span class="number">5</span>, <span class="number">20</span>, <span class="number">15</span>];
<span class="variable">$numbers2</span> = [<span class="number">-1</span>, <span class="number">-5</span>, <span class="number">-2</span>];
<span class="variable">$numbers3</span> = [];

<span class="keyword">echo</span> <span class="string">"El número más grande en [10, 5, 20, 15] es: "</span> . <span class="function-name">findMaxArrayPHP</span>(<span class="variable">$numbers1</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: 20</span>
<span class="keyword">echo</span> <span class="string">"El número más grande en [-1, -5, -2] es: "</span> . <span class="function-name">findMaxArrayPHP</span>(<span class="variable">$numbers2</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: -1</span>
<span class="keyword">echo</span> <span class="string">"El número más grande en []: "</span> . <span class="function-name">findMaxArrayPHP</span>(<span class="variable">$numbers3</span>) . <span class="string">"&lt;br&gt;"</span>; <span class="comment">// Salida: Error...</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `El número más grande en [10, 5, 20, 15] es: 20\nEl número más grande en [-1, -5, -2] es: -1\nEl número más grande en []: Error: El array no puede estar vacío.`,
        rawJsCode: `function findMaxArrayJS(arr) {
    if (arr.length === 0) {
        return "Error: El array no puede estar vacío.";
    }
    return Math.max(...arr);
}

const numbers1 = [10, 5, 20, 15];
const numbers2 = [-1, -5, -2];
const numbers3 = [];

console.log(\`El número más grande en [10, 5, 20, 15] es: \${findMaxArrayJS(numbers1)}\`);
console.log(\`El número más grande en [-1, -5, -2] es: \${findMaxArrayJS(numbers2)}\`);
console.log(\`El número más grande en []: \${findMaxArrayJS(numbers3)}\`);`,
        jsCodeDisplay: `<span class="comment">// Función para encontrar el número más grande en un array en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">findMaxArrayJS</span>(<span class="variable">arr</span>) {
    <span class="keyword">if</span> (<span class="variable">arr</span>.<span class="method">length</span> === <span class="number">0</span>) {
        <span class="keyword">return</span> <span class="string">"Error: El array no puede estar vacío."</span>;
    }
    <span class="keyword">return</span> <span class="function-name">Math</span>.<span class="method">max</span>(...<span class="variable">arr</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">numbers1</span> = [<span class="number">10</span>, <span class="number">5</span>, <span class="number">20</span>, <span class="number">15</span>];
<span class="keyword">const</span> <span class="variable">numbers2</span> = [<span class="number">-1</span>, <span class="number">-5</span>, <span class="number">-2</span>];
<span class="keyword">const</span> <span class="variable">numbers3</span> = [];

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`El número más grande en [10, 5, 20, 15] es: \${findMaxArrayJS(numbers1)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`El número más grande en [-1, -5, -2] es: \${findMaxArrayJS(numbers2)}\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`El número más grande en []: \${findMaxArrayJS(numbers3)}\`</span>);`,
        jsOutput: `El número más grande en [10, 5, 20, 15] es: 20\nEl número más grande en [-1, -5, -2] es: -1\nEl número más grande en []: Error: El array no puede estar vacío.`
    },
    {
        id: 'sort-array',
        name: 'Ordenar un Array de Números',
        description: 'Ordena un array de números de forma ascendente. Utiliza un algoritmo de ordenamiento simple o la función de ordenamiento nativa del lenguaje.',
        rawPhpCode: `<?php

function sortArrayPHP($arr) {
    sort($arr); // Ordena el array in-place
    return $arr;
}

$numbers1 = [5, 2, 8, 1, 9];
$numbers2 = [3, 1, 4, 1, 5, 9, 2];

echo "Array original: [5, 2, 8, 1, 9]<br>";
echo "Array ordenado: [" . implode(", ", sortArrayPHP($numbers1)) . "]<br><br>";

echo "Array original: [3, 1, 4, 1, 5, 9, 2]<br>";
echo "Array ordenado: [" . implode(", ", sortArrayPHP($numbers2)) . "]<br>";

?>`,
        phpCodeDisplay: `<span class="keyword">&lt;?php</span>

<span class="comment">// Función para ordenar un array en PHP</span>
<span class="keyword">function</span> <span class="function-name">sortArrayPHP</span>(<span class="variable">$arr</span>) {
    <span class="function-name">sort</span>(<span class="variable">$arr</span>); <span class="comment">// Ordena el array in-place</span>
    <span class="keyword">return</span> <span class="variable">$arr</span>;
}

<span class="comment">// Ejemplos de uso:</span>
<span class="variable">$numbers1</span> = [<span class="number">5</span>, <span class="number">2</span>, <span class="number">8</span>, <span class="number">1</span>, <span class="number">9</span>];
<span class="variable">$numbers2</span> = [<span class="number">3</span>, <span class="number">1</span>, <span class="number">4</span>, <span class="number">1</span>, <span class="number">5</span>, <span class="number">9</span>, <span class="number">2</span>];

<span class="keyword">echo</span> <span class="string">"Array original: [5, 2, 8, 1, 9]&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"Array ordenado: ["</span> . <span class="function-name">implode</span>(<span class="string">", "</span>, <span class="function-name">sortArrayPHP</span>(<span class="variable">$numbers1</span>)) . <span class="string">"]&lt;br&gt;&lt;br&gt;"</span>; <span class="comment">// Salida: [1, 2, 5, 8, 9]</span>

<span class="keyword">echo</span> <span class="string">"Array original: [3, 1, 4, 1, 5, 9, 2]&lt;br&gt;"</span>;
<span class="keyword">echo</span> <span class="string">"Array ordenado: ["</span> . <span class="function-name">implode</span>(<span class="string">", "</span>, <span class="function-name">sortArrayPHP</span>(<span class="variable">$numbers2</span>)) . <span class="string">"]&lt;br&gt;"</span>; <span class="comment">// Salida: [1, 1, 2, 3, 4, 5, 9]</span>

<span class="keyword">?&gt;</span>`,
        phpOutput: `Array original: [5, 2, 8, 1, 9]\nArray ordenado: [1, 2, 5, 8, 9]\n\nArray original: [3, 1, 4, 1, 5, 9, 2]\nArray ordenado: [1, 1, 2, 3, 4, 5, 9]`,
        rawJsCode: `function sortArrayJS(arr) {
    // Usamos slice() para no modificar el array original
    return arr.slice().sort((a, b) => a - b);
}

const numbers1 = [5, 2, 8, 1, 9];
const numbers2 = [3, 1, 4, 1, 5, 9, 2];

console.log(\`Array original: [\${numbers1}]\`);
console.log(\`Array ordenado: [\${sortArrayJS(numbers1)}]\`);

console.log(\`\\nArray original: [\${numbers2}]\`);
console.log(\`Array ordenado: [\${sortArrayJS(numbers2)}]\`);`,
        jsCodeDisplay: `<span class="comment">// Función para ordenar un array en JavaScript</span>
<span class="keyword">function</span> <span class="function-name">sortArrayJS</span>(<span class="variable">arr</span>) {
    <span class="comment">// Usamos slice() para no modificar el array original</span>
    <span class="keyword">return</span> <span class="variable">arr</span>.<span class="method">slice</span>().<span class="method">sort</span>((<span class="variable">a</span>, <span class="variable">b</span>) => <span class="variable">a</span> - <span class="variable">b</span>);
}

<span class="comment">// Ejemplos de uso:</span>
<span class="keyword">const</span> <span class="variable">numbers1</span> = [<span class="number">5</span>, <span class="number">2</span>, <span class="number">8</span>, <span class="number">1</span>, <span class="number">9</span>];
<span class="keyword">const</span> <span class="variable">numbers2</span> = [<span class="number">3</span>, <span class="number">1</span>, <span class="number">4</span>, <span class="number">1</span>, <span class="number">5</span>, <span class="number">9</span>, <span class="number">2</span>];

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Array original: [\${numbers1}]\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Array ordenado: [\${sortArrayJS(numbers1)}]\`</span>);

<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`\\nArray original: [\${numbers2}]\`</span>);
<span class="function-name">console</span>.<span class="method">log</span>(<span class="string">\`Array ordenado: [\${sortArrayJS(numbers2)}]\`</span>);`,
        jsOutput: `Array original: [5,2,8,1,9]\nArray ordenado: [1,2,5,8,9]\n\nArray original: [3,1,4,1,5,9,2]\nArray ordenado: [1,1,2,3,4,5,9]`
    }
];

// Elementos del DOM para el comparador
const taskSelect = document.getElementById('task-select');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const phpCodeDisplay = document.getElementById('php-code-display');
const jsCodeDisplay = document.getElementById('js-code-display');
const phpOutputDiv = document.getElementById('php-output').querySelector('.output-content');
const jsOutputDiv = document.getElementById('js-output').querySelector('.output-content');

// Función para cargar los detalles y el código de una tarea
function loadTask(taskId) {
    const task = programmingTasks.find(t => t.id === taskId);
    if (task) {
        taskTitle.innerHTML = task.name;
        taskDescription.innerHTML = task.description;
        phpCodeDisplay.innerHTML = task.phpCodeDisplay;
        jsCodeDisplay.innerHTML = task.jsCodeDisplay;

        // Limpiar salidas anteriores
        phpOutputDiv.textContent = '';
        jsOutputDiv.textContent = '';
    } else {
        console.error('Tarea no encontrada:', taskId);
    }
}

// Función para ejecutar código PHP (simulada)
function runPhpCode(taskId) {
    const task = programmingTasks.find(t => t.id === taskId);
    if (task && task.phpOutput) {
        phpOutputDiv.textContent = task.phpOutput;
    } else {
        phpOutputDiv.textContent = 'La ejecución de PHP requiere un servidor. Mostrando salida simulada.';
    }
}

// Función para ejecutar código JavaScript en un iframe sandboxed
function runJsCode(taskId) {
    const task = programmingTasks.find(t => t.id === taskId);
    if (task && task.rawJsCode) {
        // Limpiar salida anterior
        jsOutputDiv.textContent = '';

        // Crear un iframe oculto para ejecutar el código de forma segura
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Capturar la consola del iframe
        let jsConsoleOutput = '';
        iframe.contentWindow.console.log = (...args) => {
            jsConsoleOutput += args.join(' ') + '\n';
        };
        iframe.contentWindow.console.error = (...args) => {
            jsConsoleOutput += 'Error: ' + args.join(' ') + '\n';
        };
        iframe.contentWindow.console.warn = (...args) => {
            jsConsoleOutput += 'Advertencia: ' + args.join(' ') + '\n';
        };
        iframe.contentWindow.alert = (msg) => {
            jsConsoleOutput += 'Alerta: ' + msg + '\n';
        };

        try {
            // Ejecutar el código JS dentro del contexto del iframe
            iframe.contentWindow.eval(task.rawJsCode);
        } catch (error) {
            jsConsoleOutput += 'Error de ejecución: ' + error.message + '\n';
        } finally {
            // Mostrar la salida capturada
            jsOutputDiv.textContent = jsConsoleOutput;
            // Eliminar el iframe
            document.body.removeChild(iframe);
        }
    } else {
        jsOutputDiv.textContent = 'No hay código JavaScript para ejecutar.';
    }
}


// Inicializar el selector de tareas y cargar la primera tarea al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Solo si estamos en la página del comparador (verificando si los elementos existen)
    if (taskSelect && taskTitle && taskDescription && phpCodeDisplay && jsCodeDisplay) {
        // Llenar el dropdown con las tareas
        programmingTasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.name;
            taskSelect.appendChild(option);
        });

        // Cargar la primera tarea por defecto
        loadTask(programmingTasks[0].id);

        // Añadir event listener para el cambio de tarea
        taskSelect.addEventListener('change', (event) => {
            loadTask(event.target.value);
        });

        // Añadir event listeners a los botones de ejecución
        document.querySelectorAll('.run-code-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const lang = event.target.dataset.lang;
                const currentTaskId = taskSelect.value;
                if (lang === 'php') {
                    runPhpCode(currentTaskId);
                } else if (lang === 'js') {
                    runJsCode(currentTaskId);
                }
            });
        });
    }
});
