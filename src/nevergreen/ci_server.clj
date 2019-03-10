(ns nevergreen.ci-server
  (:require [clojure.test :refer :all]
            [clojure.set :refer [difference]]
            [clj-time.core :as clock]
            [clojure.string :as s]
            [clojure.string :refer [includes?]]
            [clj-cctray.util :refer [in?]]))

(defn ^:dynamic now []
  (clock/now))

(defn- generate-project-id [project]
  (s/join "/" (remove nil? (map project [:unnormalised-owner :unnormalised-name :unnormalised-stage :unnormalised-job]))))

(defn- add-project-ids [projects]
  (map #(assoc % :project-id (generate-project-id %)) projects))

(defn- add-server-type [server-type projects]
  (map #(assoc % :server-type server-type) projects))

(defn- add-tray-id [tray-id projects]
  (map #(assoc % :tray-id tray-id) projects))

(defn- add-url [url projects]
  (map #(assoc % :url url) projects))

(defn- add-fetched-time [projects]
  (map #(assoc % :fetched-time (now)) projects))

(defn- add-is-new [seen projects]
  (let [new-project-ids (difference (set (map :project-id projects)) (set seen))]
    (map #(assoc % :is-new (or (in? new-project-ids (:project-id %)) false)) projects)))

(defn- detect-server [url]
  (cond
    (nil? url) nil
    (includes? url "//jenkins") :jenkins
    (includes? url ".ci.cloudbees.com") :jenkins
    (includes? url "//hudson") :hudson
    (includes? url "//travis-ci.org") :travis
    (includes? url "/go/") :go
    (includes? url "//circleci.com") :circle
    (includes? url "//teamcity") :team-city
    (includes? url "//cc.rb.") :cruise-control-rb
    (includes? url "//cc.java.") :cruise-control
    (includes? url "//cc.net.") :cruise-control-net
    (includes? url "//api.tddium.com") :solano
    :else :unknown))

(defn- unknown-server? [server-type]
  (not (in? [:jenkins
             :hudson
             :travis
             :go
             :circle
             :team-city
             :cruise-control-rb
             :cruise-control
             :cruise-control-net
             :solano] server-type)))

(defn enrich-projects [{:keys [server-type tray-id url seen]} projects]
  (->>
    (add-project-ids projects)
    (add-server-type server-type)
    (add-tray-id tray-id)
    (add-url url)
    (add-fetched-time)
    (add-is-new seen)))

(defn get-server-type [{:keys [server-type url]}]
  (let [server-keyword (keyword server-type)]
    (if (unknown-server? server-keyword)
      (detect-server url)
      server-keyword)))
