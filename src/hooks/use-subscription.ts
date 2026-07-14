"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getPlans, getSubscription, getUsage, getBillingHistory, changeSubscription } from "@/lib/api";
import type { BillingEvent, Plan, SubscriptionState, UsageSummary } from "@/types";

const CACHE_TTL_MS = 30_000;

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  const fetchSubscription = useCallback(async (force = false) => {
    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < CACHE_TTL_MS) {
      return subscription;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [subscriptionData, plansData] = await Promise.all([getSubscription(), getPlans()]);
      setSubscription(subscriptionData);
      setPlans(plansData.plans ?? []);
      setLastFetchedAt(Date.now());
      return subscriptionData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscription data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchedAt, subscription]);

  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  const changePlan = useCallback(async (planCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const next = await changeSubscription(planCode);
      setSubscription(next);
      setLastFetchedAt(Date.now());
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change plan");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo(
    () => ({ subscription, plans, isLoading, error, refetch: fetchSubscription, changePlan }),
    [subscription, plans, isLoading, error, fetchSubscription, changePlan]
  );
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  const fetchUsage = useCallback(async (force = false) => {
    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < CACHE_TTL_MS) {
      return usage;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsage();
      setUsage(data);
      setLastFetchedAt(Date.now());
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load usage data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchedAt, usage]);

  useEffect(() => {
    void fetchUsage();
  }, [fetchUsage]);

  return useMemo(() => ({ usage, isLoading, error, refetch: fetchUsage }), [usage, isLoading, error, fetchUsage]);
}

export function useBilling() {
  const [billing, setBilling] = useState<BillingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  const fetchBilling = useCallback(async (force = false) => {
    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < CACHE_TTL_MS) {
      return billing;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getBillingHistory();
      setBilling(data.events ?? []);
      setLastFetchedAt(Date.now());
      return data.events ?? [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load billing history");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [billing, lastFetchedAt]);

  useEffect(() => {
    void fetchBilling();
  }, [fetchBilling]);

  return useMemo(() => ({ billing, isLoading, error, refetch: fetchBilling }), [billing, isLoading, error, fetchBilling]);
}
