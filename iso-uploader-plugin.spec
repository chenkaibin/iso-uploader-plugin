%define _version 0.5
%define _release 3

Name:		iso-uploader-plugin
Version:	%{_version}
Release:	%{_release}%{?dist}
Summary:	Engine ISO Uploader UIPlugin for ovirt

Group:		oVirt
License:	GPL
URL:		http://www.ovirt-china.org
Source0:	iso-uploader-plugin-%{_version}.tar.gz
BuildRoot:	%(mktemp -ud %{_tmppath}/%{name}-%{version}-%{release}-XXXXXX)

BuildRequires:	bash
Requires:	ovirt-engine >= 3.5.0
Requires:	ovirt-iso-uploader

%description
Temp method for iso iamge upload from webadmin ui,
would be replaced by ovirt-imageio in the futrue.

%prep
%setup -q


%build
cd Servlet/iso-uploader-plugin
mvn clean package war:war


%install
rm -rf %{buildroot}
mkdir -p %{buildroot}/usr/share/ovirt-engine/ui-plugins/
mkdir -p %{buildroot}/usr/share/ovirt-engine/setup/plugins/ovirt-engine-setup/iso-uploader-plugin/
mkdir -p %{buildroot}/usr/share/iso-uploader-plugin/deployments/
mkdir -p %{buildroot}/etc/httpd/conf.d/
mkdir -p %{buildroot}/etc/iso-uploader-plugin
mkdir -p %{buildroot}/usr/lib/systemd/system
mkdir -p %{buildroot}/var/log/iso-uploader-plugin
mkdir -p %{buildroot}/usr/sbin/
cp -r UIPlugin/* %{buildroot}/usr/share/ovirt-engine/ui-plugins/
cp -r otopi/* %{buildroot}/usr/share/ovirt-engine/setup/plugins/ovirt-engine-setup/iso-uploader-plugin/
cp Servlet/iso-uploader-plugin/target/iso-uploader-plugin.war %{buildroot}/usr/share/iso-uploader-plugin/deployments/
cp iso-uploader-plugin.conf %{buildroot}/etc/httpd/conf.d/
cp iso-uploader-plugin.service %{buildroot}/usr/lib/systemd/system
cp iso-uploader-plugin.xml %{buildroot}/etc/iso-uploader-plugin/
touch %{buildroot}/etc/iso-uploader-plugin/mgmt-users.properties
touch %{buildroot}/etc/iso-uploader-plugin/mgmt-groups.properties
touch %{buildroot}/etc/iso-uploader-plugin/application-users.properties
touch %{buildroot}/etc/iso-uploader-plugin/application-roles.properties


%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root,-)
%config /etc/httpd/conf.d/iso-uploader-plugin.conf
%config /etc/iso-uploader-plugin/iso-uploader-plugin.xml
%attr(0644,root,root) /usr/lib/systemd/system/iso-uploader-plugin.service
/etc/httpd/conf.d/
/etc/iso-uploader-plugin/
/usr/share/ovirt-engine/ui-plugins/
/usr/share/ovirt-engine/setup/plugins/ovirt-engine-setup/iso-uploader-plugin/
/usr/share/iso-uploader-plugin/
/var/log/iso-uploader-plugin/


%changelog
* Fri Dec 19 2014 MaZhe <zhe.ma@eayun.com> 0.5-2
- Project rename
  Remove a lot of useless code
  Small Improvements in the UI
  New README
  New Documentation


* Fri Dec  5 2014 PanLiyang <liyang.pan@eayun.com> 0.5-1
- Remove logging file handler

* Fri Dec  5 2014 FengKai <lucas.vandroux@eayun.com> 0.5-0
- Packaging by MaZhe <zhe.ma@eayun.com>
- The plugin is now available in English and in Simplified Chinese.
- The users can enter the password of a domain directly from the UI (no need to use a PasswordFile anymore)
- Bug fixes

* Mon Dec  1 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.5
- Modify setup script

* Mon Dec  1 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.4
- Add setup script

* Tue Nov 25 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.3
- Fix rewrite service run method

* Mon Nov 24 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.2
- Fix service cannot check and terminate existing proccess

* Fri Nov 21 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.1
- Add system service script

* Thu Nov 20 2014 MaZhe <zhe.ma@eayun.com> 0.4-2
- First build
