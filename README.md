# Incus-UI-Canonical

Incus-UI-Canonical is a browser frontend for [Incus](https://github.com/lxc/incus). It enables easy and accessible container and virtual machine management.
Targets small and large scale private clouds.

# Background

This [Incus-UI-Canonical](https://osamuaoki.github.com/incus-ui-canonical) is a forked project of [LXD-UI](https://github.com/canonical/lxd-ui).

This [Incus-UI-Canonical](https://osamuaoki.github.com/incus-ui-canonical) is targeted to work with [Incus](https://github.com/lxc/incus) instead of [LXD](https://github.com/canonical/lxd).

[LXD has been moved to Canonical](https://linuxcontainers.org/lxd/) and a community fork of LXD, [Incus](https://github.com/lxc/incus), is now part of the [Linux Containers project](https://linuxcontainers.org/).

Canonical packages [LXD-UI](https://github.com/canonical/lxd-ui) as a part of `lxd` snap package.

Lead [Incus](https://github.com/lxc/incus) developer zabby is providing his `incus` deb package at [Incus package repository](https://github.com/zabbly/incus).  Zabby bundles patched lxd-ui web page into `/opt/incus/ui` of his deb package.

When I filed [a wishlist bug report to bundle zabby's static web page in Debian's incus package: #1067041](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1067041) and got a reasonable response that such thing needs to be packaged as a separate package.

Here is my first try to create such package which can work with the official [Debian's incus package](https://tracker.debian.org/pkg/incus).

Essential part of package modifications are copied from zabby's [workflow](https://github.com/zabbly/incus/blob/daily/.github/workflows/builds.yml) and [ui-canonical-* patches and sed script](https://github.com/zabbly/incus/tree/daily/patches).

I realized existence of zabby's code and structure from others packaging this part of code.

* https://github.com/KosmX/incus-ui-canonical-arch Arch Linux package
* https://gist.github.com/vaxvhbe/ce679df15fc521c8aca1ff9ddf537201 RPM spec file?

# Install

    sudo apt update
    sudo apt devscripts yarnpkg npm
    git clone https://osamuaoki.github.com/incus-ui-canonical
    cd incus-ui-canonical
    git remote add canonical https://github.com/canonical/lxd-ui
    #origtargz
    git archive --prefix=incus-ui-canonical-0.6/ --format=tar.gz -o ../incus-ui-canonical_0.6.orig.tar.gz incus-ui-canonical/0.6
    git checkout debian
    debuild
    cd ..
    sudo dpkg -i incus-ui-canonical*.deb

The above deb-package build process accesses the external javascript repository site outside of the official Debian package repository.

Thus this generated binary deb package is not ready to be uploaded to the Debian repository.

# Configuration of Incus

You need to start the incus daemon while setting its environment with `INCUS_UI=/var/lib/incus/ui`.

You can set it in `/etc/environment` until the official `incus` package support this.


  incus config set core.https_address ":8443"

Then start any modern browser with it URL pointing to https://localhost:8443.

# LICENSE

See [LICENSE](LICENSE) and each file.  My code is under GPL3.

# TODO

* Update to newer lxd-ui. (0.7)
* Provide deb in an external apt repository.
* Make this build to be compliant for the uploading to Debian repository.

# Reference information

Please refer to the guide and references available for LXD-UI.

* Substitute `lxc` command with `incus` command.
* Substitute `lxdbr0` with `incusbr0` for network device.
* Substitute `LXD_*` environment variables with `INCUS_*` environment variables.

Please don't report issues of this fork to Canonical.

The followings are quoted from the original LXD-UI by Canonical with section headers made to be subsection headers

>    # LXD-UI
>
>    LXD-UI is a browser frontend for LXD. It enables easy and accessible container and virtual machine management.
>    Targets small and large scale private clouds.
>
>    # Install
>
>    Get the LXD snap
>
>        sudo snap install --channel=latest/stable lxd
>
>    Or refresh to ensure at least version 5.14 is installed
>
>        sudo snap refresh --channel=latest/stable lxd
>
>    Follow the guide to [access the LXD web UI](https://documentation.ubuntu.com/lxd/en/latest/howto/access_ui/).
>
>    # Contributing
>
>    You might want to:
>
>    - [View the source](https://github.com/canonical/lxd-ui) on GitHub.
>    - Read about [running the UI from git checkout](HACKING.md), tests and advanced setup.
>
>    # Architecture
>
>    LXD-UI is a single page application written in TypeScript and React. See [Architecture](ARCHITECTURE.MD) for details on bundling with [LXD](https://github.com/canonical/lxd) and the dev setup.
>
>    # Examples
>
>    | Create an instance                                                                                  | Instance list                                                                                                  | Instance terminal                                                                                          |
>    |-----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
>    | ![0create](https://github.com/canonical/lxd-ui/assets/1155472/7f0c45a6-2ba2-4cc7-bd7c-c0ebca76d648) | ![1instance-overview](https://github.com/canonical/lxd-ui/assets/1155472/c71d2153-ea71-4ecb-ab25-fabcd6fb1e55) | ![2instance-term](https://github.com/canonical/lxd-ui/assets/1155472/c2b741e2-8806-4d4d-9a9a-f536f76a13b9) |
>
>    | Graphic console                                                                                                | Profile list                                                                                             | Cluster groups                                                                                                        |
>    |----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
>    | ![3-instance-console](https://github.com/canonical/lxd-ui/assets/1155472/0f8d742d-3f9c-4906-90da-e740e8ff353b) | ![profile-list](https://github.com/canonical/lxd-ui/assets/1155472/36a0f619-767f-4949-804d-061e5e28c87a) | ![6cluster](https://github.com/canonical/lxd-ui/assets/1155472/85f61ef9-a45f-4b4a-abee-8fa9dfa69bd2) |
>
>    | Storage                                                                                               | Operations                                                                                             | Warnings                                                                                             |
>    |-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
>    | ![5storage](https://github.com/canonical/lxd-ui/assets/1155472/38d7b8ab-d652-4c18-b71e-0098efe73702)  | ![operations](https://github.com/canonical/lxd-ui/assets/1155472/d3168891-19fb-4724-95cb-9afc91191555) | ![warnings](https://github.com/canonical/lxd-ui/assets/1155472/56499dfc-15a2-4c59-8761-47709b4be957) |
