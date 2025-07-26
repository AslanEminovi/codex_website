// CodexCMS - Main JavaScript File

document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Add fade-in animation to elements with fade-in-up class
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in-up").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Form validation enhancement
  const forms = document.querySelectorAll(".needs-validation");
  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });

  // File upload preview
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const preview = this.parentElement.querySelector(".file-preview");
        if (preview) {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
              preview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" style="max-height: 200px;">`;
            };
            reader.readAsDataURL(file);
          } else {
            preview.innerHTML = `<div class="alert alert-info">Selected file: ${file.name}</div>`;
          }
        }
      }
    });
  });

  // Rich text editor enhancement
  const textareas = document.querySelectorAll("textarea[data-rich-editor]");
  textareas.forEach((textarea) => {
    // Add basic formatting buttons
    const toolbar = document.createElement("div");
    toolbar.className = "rich-editor-toolbar mb-2";
    toolbar.innerHTML = `
            <button type="button" class="btn btn-sm btn-secondary" data-command="bold">
                <i class="bi bi-type-bold"></i>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-command="italic">
                <i class="bi bi-type-italic"></i>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-command="underline">
                <i class="bi bi-type-underline"></i>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-command="insertUnorderedList">
                <i class="bi bi-list-ul"></i>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-command="insertOrderedList">
                <i class="bi bi-list-ol"></i>
            </button>
        `;

    textarea.parentElement.insertBefore(toolbar, textarea);

    toolbar.addEventListener("click", function (e) {
      if (e.target.closest("button")) {
        e.preventDefault();
        const command = e.target.closest("button").dataset.command;
        document.execCommand(command, false, null);
        textarea.focus();
      }
    });
  });

  // Search functionality
  const searchInputs = document.querySelectorAll(".search-input");
  searchInputs.forEach((input) => {
    let searchTimeout;
    input.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = this.value.toLowerCase();
        const items =
          this.closest(".search-container").querySelectorAll(".search-item");

        items.forEach((item) => {
          const text = item.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      }, 300);
    });
  });

  // Modal enhancements
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("shown.bs.modal", function () {
      const firstInput = this.querySelector("input, textarea, select");
      if (firstInput) {
        firstInput.focus();
      }
    });
  });

  // Table enhancements
  const tables = document.querySelectorAll(".table");
  tables.forEach((table) => {
    // Add responsive wrapper
    if (!table.parentElement.classList.contains("table-responsive")) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";
      table.parentElement.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });

  // Loading states for buttons
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  submitButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (this.form && this.form.checkValidity()) {
        this.disabled = true;
        this.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
      }
    });
  });

  // Copy to clipboard functionality
  const copyButtons = document.querySelectorAll("[data-copy]");
  copyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const textToCopy = this.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      });
    });
  });

  // Theme toggle (if implemented)
  const themeToggle = document.querySelector("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
});

// Utility functions
window.CodexCMS = {
  // Show loading spinner
  showLoading: function () {
    const spinner = document.createElement("div");
    spinner.className = "loading-overlay";
    spinner.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(spinner);
  },

  // Hide loading spinner
  hideLoading: function () {
    const spinner = document.querySelector(".loading-overlay");
    if (spinner) {
      spinner.remove();
    }
  },

  // Show notification
  showNotification: function (message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  },

  // Format date
  formatDate: function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Debounce function
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};
