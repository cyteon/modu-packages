<script lang="ts">
    import NavBar from "$lib/components/NavBar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { onMount } from "svelte";
    import { marked } from "marked";
    import DOMPurify from "dompurify";
    import { getUser } from "$lib/db.js";
    import { onNavigate } from "$app/navigation";

    export let data;

    let pkg = {}
    let packageName = "";
    let version = "latest";
    let error = "";

    async function loadPackage(name: string, ver: string) {
        error = "";
        const res = await fetch(`/api/v1/packages/${name}/${ver}`);

        if (res.ok) {
            pkg = await res.json();

            pkg.readme = DOMPurify.sanitize(marked(pkg.readme));
            pkg.username = (await getUser(pkg.ownerId)).username;
        } else {
            error = await res.text();

            if (error.length === 0 || error.length > 100) {
                error = "An unknown error has occurred";
            }
        }
    }

    onMount(async () => {
        if (data.props.name.split("@").length > 1) {
            const parts = data.props.name.split("@");
            packageName = parts[0];
            version = parts[1];
        } else {
            packageName = data.props.name;
        }

        await loadPackage(packageName, version);
    });

    async function changeVersion(newVersion: string) {
        version = newVersion;
        await loadPackage(packageName, newVersion);
        
        const newUrl = `/package/${packageName}@${newVersion}`;
        window.history.pushState({}, '', newUrl);
        document.title = `${packageName}@${newVersion}`;
    }

    function timeSince(unix) {
        const seconds = Math.floor((Date.now() - unix) / 1000);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} minutes ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return `${hours} hours ago`;
        } else {
            let days = Math.floor(seconds / 86400);

            if (days > 30) {
                const months = Math.floor(days / 30);
                return `${months} months ago`;
            } else if (days > 365) {
                const years = Math.floor(days / 365);
                return `${years} years ago`;
            } else {
                return `${days} days ago`;
            }
        }
    }
</script>

<div class="flex flex-col h-screen w-full">
    <NavBar />

    {#if error}
        <div class="m-auto text-center">
            <h1 class="text-4xl font-bold">An error occurred</h1>
            <p class="text-xl text-red">{error}</p>
        </div>
    {:else}
        <div class="flex flex-col w-full md:w-2/3 mx-auto mt-16 mb-4 px-2">
            <div>
                <h1 class="text-4xl font-bold">{packageName}</h1>
                <p class="text-fg2 mt-2">{pkg.version} • Updated {timeSince(new Date(pkg.createdAt).getTime())} • {pkg.downloadCount} downloads</p>
            </div>
            
            <div class="flex flex-col md:flex-row mt-4 md:space-x-4">
                <div class="flex flex-col w-full">
                    <div class="bg-bg1 border border-bg2 rounded-md p-4">
                        <p class="text-lg prose max-w-none">{@html pkg.readme}</p>
                    </div>
                </div>

                <div class="flex flex-col w-full md:w-1/3 md:mt-0">
                    <p class="mb-2">Install</p>
                    <code class="bg-bg1 border border-bg2 rounded-md p-4">modu install {packageName}@{pkg.version}</code>
                    <p class="mt-2 mb-2">Latest versions</p>
                    <div class="flex flex-col space-y-2">
                        {#each pkg.allReleases?.slice(0, 3) as release}
                            <button on:click={() => changeVersion(release.version)} class="bg-bg1 border border-bg2 rounded-md p-2 hover:bg-bg2 text-left w-full">
                                <h3 class="font-semibold">{release.version}</h3>
                                <p class="text-fg2 text-sm">{timeSince(new Date(release.createdAt).getTime())} • {release.downloadCount} downloads</p>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    
    <Footer />
</div>