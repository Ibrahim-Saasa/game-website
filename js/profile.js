document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");
  const nameInput = document.getElementById("playerNameInput");
  const avatarInput = document.getElementById("avatarInput");
  const avatar = document.getElementById("profileAvatar");
  const initials = document.getElementById("avatarInitials");
  const status = document.getElementById("profileStatus");
  const libraryGrid = document.getElementById("libraryGrid");
  const wishlistTab = document.getElementById("wishlistTab");
  const purchasesTab = document.getElementById("purchasesTab");
  const logoutButton = document.getElementById("logoutButton");
  let profileUser;
  let library = { wishlist: [], purchases: [] };
  let activeList = "wishlist";

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  }

  function setAvatar(user) {
    const name = user.player_name || "Player";
    initials.textContent = name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    if (user.avatar_path) {
      avatar.src = `./${user.avatar_path}`;
      avatar.hidden = false;
      initials.hidden = true;
    } else {
      avatar.hidden = true;
      initials.hidden = false;
    }
  }

  function renderProfile(user) {
    profileUser = user;
    document.getElementById("profileName").textContent = user.player_name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileSince").textContent =
      `Joined ${new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })}`;
    document.getElementById("wishlistCount").textContent = user.wishlist_count;
    document.getElementById("purchaseCount").textContent = user.purchase_count;
    nameInput.value = user.player_name;
    setAvatar(user);
  }

  function renderLibrary() {
    const items = library[activeList] || [];
    if (!items.length) {
      libraryGrid.innerHTML = `<p class="library-empty">${activeList === "wishlist" ? "Your wishlist is empty. Save something from Products to keep it here." : "No demo purchases yet. Record one from a product's details."}</p>`;
      return;
    }

    libraryGrid.innerHTML = items
      .map(
        (item) => `
      <article class="library-item">
        <div class="library-thumb">
          ${item.image && item.image !== "img/placeholder-product.png" ? `<img src="./${escapeHTML(item.image)}" alt="" loading="lazy">` : `<i class="bx bx-package" aria-hidden="true"></i>`}
        </div>
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.category)} · $${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          ${activeList === "wishlist" ? `<button type="button" data-remove-product="${item.id}">Remove from wishlist</button>` : `<p>Recorded ${new Date(item.purchased_at).toLocaleDateString()}</p>`}
        </div>
      </article>
    `,
      )
      .join("");
  }

  async function loadProfile() {
    try {
      const [profileResponse, libraryResponse] = await Promise.all([
        fetch("./api/profile.php", { credentials: "same-origin" }),
        fetch("./api/library.php", { credentials: "same-origin" }),
      ]);
      if (profileResponse.status === 401 || libraryResponse.status === 401) {
        window.location.replace("auth.html");
        return;
      }
      const profileResult = await profileResponse.json();
      const libraryResult = await libraryResponse.json();
      if (!profileResponse.ok) throw new Error(profileResult.message);
      if (!libraryResponse.ok) throw new Error(libraryResult.message);
      library = libraryResult;
      renderProfile(profileResult.user);
      renderLibrary();
    } catch (error) {
      status.style.color = "#e37d8e";
      status.textContent = error.message || "Could not load your profile.";
    }
  }

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const saveButton = profileForm.querySelector('button[type="submit"]');
    saveButton.disabled = true;
    status.style.color = "#78c6eb";
    status.textContent = "Saving profile...";
    try {
      const response = await fetch("./api/profile.php", {
        method: "POST",
        credentials: "same-origin",
        body: new FormData(profileForm),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Profile update failed.");
      renderProfile({ ...profileUser, ...result.user });
      status.style.color = "#73d2a7";
      status.textContent = result.message;
      avatarInput.value = "";
    } catch (error) {
      status.style.color = "#e37d8e";
      status.textContent = error.message || "Could not save your profile.";
    } finally {
      saveButton.disabled = false;
    }
  });

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      avatarInput.value = "";
      status.style.color = "#e37d8e";
      status.textContent = "Choose an image smaller than 2 MB.";
      return;
    }
    avatar.src = URL.createObjectURL(file);
    avatar.hidden = false;
    initials.hidden = true;
  });

  function activateTab(listName) {
    activeList = listName;
    const wishlistActive = listName === "wishlist";
    wishlistTab.classList.toggle("active", wishlistActive);
    purchasesTab.classList.toggle("active", !wishlistActive);
    wishlistTab.setAttribute("aria-selected", String(wishlistActive));
    purchasesTab.setAttribute("aria-selected", String(!wishlistActive));
    renderLibrary();
  }

  wishlistTab.addEventListener("click", () => activateTab("wishlist"));
  purchasesTab.addEventListener("click", () => activateTab("purchases"));

  libraryGrid.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-remove-product]");
    if (!button) return;
    button.disabled = true;
    try {
      const response = await fetch("./api/library.php", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "wishlist_remove",
          product_id: Number(button.dataset.removeProduct),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      library.wishlist = library.wishlist.filter(
        (item) => item.id !== Number(button.dataset.removeProduct),
      );
      document.getElementById("wishlistCount").textContent =
        library.wishlist.length;
      renderLibrary();
    } catch (error) {
      button.disabled = false;
      status.style.color = "#e37d8e";
      status.textContent = error.message || "Could not update your wishlist.";
    }
  });

  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    try {
      await fetch("./api/logout.php", {
        method: "POST",
        credentials: "same-origin",
      });
      window.location.replace("auth.html");
    } catch {
      logoutButton.disabled = false;
      status.style.color = "#e37d8e";
      status.textContent = "Could not sign out. Try again.";
    }
  });

  loadProfile();
});
