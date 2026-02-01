<script lang="ts">
    import { GithubIcon, Book } from "lucide-svelte";
</script>


<footer class="mt-auto bg-bg0_h p-2 border-t border-bg1 flex">
    Cyteon © 2026 - AGPL-3.0

    <a href="https://github.com/cyteon/modu-packages" target="_blank" rel="noopener noreferrer" class="ml-auto hover:text-blue">
        <GithubIcon class="h-6 w-6" />
    </a>

    <a href="https://modu.cyteon.dev/docs/libraries" target="_blank" rel="noopener noreferrer" class="hover:text-blue ml-2">
        <Book class="h-6 w-6" />
    </a>

    <a href="https://modu.cyteon.dev" target="_blank" rel="noopener noreferrer" class="ml-3">
        <img src="/favicon.webp" class="h-6 w-6" />
    </a>
</footer>
