// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos no <main> que têm um ID e podem ser alvos de navegação
  const allNavTargets = document.querySelectorAll(
    "main section[id], main article[id]"
  );
  // Seleciona todos os links <a> dentro da navegação do <aside>
  const asideNavLinks = document.querySelectorAll("aside nav a");

  // Armazena os elementos observados que estão atualmente intersectando (visíveis)
  // A chave é o ID do elemento, o valor é o objeto 'entry' do IntersectionObserver
  const visibleElements = new Map();

  const observerOptions = {
    root: null, // Define a viewport como a raiz de observação
    rootMargin: "0px", // Nenhuma margem adicional, observa a viewport real
    threshold: [0, 0.2, 0.8, 1.0], // Dispara o callback quando 0%, 20%, 80% ou 100% do elemento está visível.
    // O threshold 0 é crucial para saber quando um elemento sai completamente da tela.
    // Ter múltiplos thresholds ajuda a refinar qual elemento está "mais" visível.
    // Você pode experimentar com valores menores como [0, 0.1] se a detecção não estiver sensível o suficiente.
  };

  // Função para ativar o link correto no menu lateral
  const activateLinkForId = (idToActivate) => {
    // Remove a classe 'active' de todos os links do menu lateral
    asideNavLinks.forEach((link) => {
      link.classList.remove("active");
    });

    if (idToActivate) {
      // Encontra o link no 'aside' que corresponde ao ID do elemento visível
      const targetLink = document.querySelector(
        `aside nav a[href="#${idToActivate}"]`
      );
      if (targetLink) {
        // Adiciona a classe 'active' ao link do elemento visível (seja ele principal ou subtópico)
        targetLink.classList.add("active");

        // Se o link ativo for um sub-link (identificado pela sua estrutura HTML no 'aside')
        // também ativa o link da categoria pai.
        if (targetLink.matches("aside nav ul ul a")) {
          const parentLi = targetLink.closest("ul").closest("li"); // Encontra o <li> pai da categoria
          if (parentLi) {
            const parentCategoryLink = parentLi.querySelector("a.nav-link"); // Encontra o link principal da categoria
            if (parentCategoryLink) {
              parentCategoryLink.classList.add("active");
            }
          }
        }
      }
    }
  };

  // Função para determinar qual link deve estar ativo com base nos elementos visíveis
  const updateActiveLink = () => {
    if (visibleElements.size === 0) {
      activateLinkForId(null); // Nenhum elemento observado está visível, então limpa todos os destaques.
      return;
    }

    let topMostVisibleId = null;
    let minTopValue = Infinity; // Usado para encontrar o elemento mais ao topo
    let maxIntersectionRatio = 0; // Usado como critério secundário

    visibleElements.forEach((entry, id) => {
      const rect = entry.target.getBoundingClientRect();

      // Considera apenas elementos que estão efetivamente na viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (topMostVisibleId === null || rect.top < minTopValue) {
          // Este elemento está mais acima do que o candidato atual
          minTopValue = rect.top;
          topMostVisibleId = id;
          maxIntersectionRatio = entry.intersectionRatio;
        } else if (rect.top === minTopValue) {
          // Elementos no mesmo nível de topo: prefere o que tem maior área visível
          if (entry.intersectionRatio > maxIntersectionRatio) {
            topMostVisibleId = id;
            maxIntersectionRatio = entry.intersectionRatio;
          }
        }
      }
    });
    activateLinkForId(topMostVisibleId);
  };

  // Cria e configura o IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Adiciona o elemento ao Map se ele estiver visível
        visibleElements.set(entry.target.id, entry);
      } else {
        // Remove o elemento do Map se ele não estiver mais visível
        visibleElements.delete(entry.target.id);
      }
    });
    // Após processar todas as mudanças, atualiza qual link deve estar ativo
    updateActiveLink();
  }, observerOptions);

  // Começa a observar cada alvo de navegação
  allNavTargets.forEach((target) => {
    if (target.id) {
      // Garante que o elemento tem um ID para ser observado
      observer.observe(target);
    }
  });

  // Lógica de clique para rolagem suave para todos os links que começam com '#'
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // Previne o comportamento padrão de navegação por âncora
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
