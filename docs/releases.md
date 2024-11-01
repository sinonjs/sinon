---
layout: default
title: Releases - Sinon.JS
permalink: /releases/index.html
redirect_from:
  - /docs
  - /docs/
  - /download
  - /download/
  - /releases/download/
  - /guides
---

<div class="head-page">
    <h1>Releases</h1>
    In addition to our download page, you can also
    <a href="#npm-cdns">use a NPM based CDN</a> for your convenience.

    <h2>Changelog</h2>
    You can see the full log of changes for each release on our separate <a href="./changelog">changelog page</a>.

</div>

### Migration guide

The [migration guide](/guides/migration-guide) covers what to think about
when migrating to a new major version. Mostly, you should not really be
practically affected by most of the major version jumps: it's mostly trivial
stuff like dropping support for a version of Node or some very minute
detail of an implementation some people _might_ depend upon.

<div class="in-content releases">
    <ul>
        {% assign sorted_releases = site.releases | sort: "sort_id" | reverse %}
        {% for release in sorted_releases %}
            {% assign url_parts = release.url | split: "/" %}

            {% comment %} Weird as hell, but .size == 3 means there are 2 elements ...
            {% endcomment %}

            {% if url_parts.size == 3 and url_parts[2] != "latest" %}
        <li>
            <p>
                <span class="ver">{{ release.release_id }}</span>
                <span class="pull-right">
                    <a
                        class="btn btn-primary"
                        href="{{site.baseurl}}/releases/sinon-{{ release.release_id | remove_first: 'v' }}.js"
                        >Download</a
                    >
                    <a
                        class="btn btn-default"
                        href="{{site.baseurl}}{{ release.url }}"
                        >Docs</a
                    >
                </span>
            </p>
        </li>
            {% endif %}
        {% endfor %}
    </ul>

</div>

<div>
    <h2 id="npm-cdns">Using NPM based CDNs</h2>
    <p>
        There are now several CDNs that are backed by NPM, which means that you
        can have auto-updated scripts. Examples of such free providers are
        <a href="http://jsdelivr.com">jsDelivr</a>,
        <a href="https://unpkg.com">UNPKG</a> and
        <a href="https://cdnjs.com">cdnjs</a>.
    </p>
    <p>
        Their addressing schemes vary, but an example url such as
        <a href="https://cdn.jsdelivr.net/npm/sinon@3/pkg/sinon.js"
            >https://cdn.jsdelivr.net/npm/sinon@3/pkg/sinon.js</a
        >
        would download the latest browser bundle of Sinon 3.
    </p>
</div>

{% comment %}
vim: ft=liquid
{%endcomment %}
